import bcrypt from "bcrypt";
import { UserRole, type User } from "@prisma/client";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

import { createModuleLogger } from "../../config/logger.js";
import prisma from "../../lib/prisma.js";
import { HttpError } from "../../utils/http-error.js";

const usersLogger = createModuleLogger("users.service");

const PASSWORD_SALT_ROUNDS = 12;

type SanitizedOrgUser = Pick<
  User,
  "id" | "organizationId" | "email" | "role" | "isVerified" | "createdAt" | "updatedAt"
>;

const orgUserSelect = {
  id: true,
  organizationId: true,
  email: true,
  role: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is not configured`);
  }

  return value;
};

const createTransporter = () => {
  const host = getRequiredEnv("EMAIL_HOST");
  const port = Number(getRequiredEnv("EMAIL_PORT"));
  const user = getRequiredEnv("EMAIL_USER");
  const pass = getRequiredEnv("EMAIL_PASS");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

const sendEmail = async (to: string, subject: string, text: string, html: string): Promise<void> => {
  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM ?? getRequiredEnv("EMAIL_USER");

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
};

const buildInvitationEmail = (token: string) => {
  const clientUrl = getRequiredEnv("CLIENT_URL");
  const acceptInviteUrl = `${clientUrl.replace(/\/$/, "")}/accept-invite?token=${token}`;

  return {
    subject: "You have been invited to join Silo",
    text: `You have been invited to join Silo. Accept your invitation here: ${acceptInviteUrl}`,
    html: `<p>You have been invited to join Silo.</p><p>Accept your invitation by clicking <a href="${acceptInviteUrl}">this link</a>.</p>`,
  };
};

const ensureNotLastAdmin = async (organizationId: string, targetUserId: string): Promise<void> => {
  const targetUser = await prisma.user.findFirst({
    where: {
      id: targetUserId,
      organizationId,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!targetUser) {
    throw new HttpError(404, "User not found in organization");
  }

  if (targetUser.role !== UserRole.ADMIN) {
    return;
  }

  const adminCount = await prisma.user.count({
    where: {
      organizationId,
      role: UserRole.ADMIN,
    },
  });

  if (adminCount <= 1) {
    throw new HttpError(409, "Cannot modify the last ADMIN in the organization");
  }
};

export const inviteUser = async (
  organizationId: string,
  invitedBy: string,
  email: string,
  role: UserRole,
): Promise<SanitizedOrgUser> => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      organizationId: true,
      email: true,
    },
  });

  if (existingUser?.organizationId === organizationId) {
    throw new HttpError(409, "A user with this email already exists in this organization");
  }

  if (existingUser) {
    throw new HttpError(409, "A user with this email already exists");
  }

  const verificationToken = uuidv4();
  const passwordHash = await bcrypt.hash(uuidv4(), PASSWORD_SALT_ROUNDS);

  const invitedUser = await prisma.user.create({
    data: {
      organizationId,
      email: normalizedEmail,
      role,
      passwordHash,
      isVerified: false,
      verificationToken,
    },
    select: orgUserSelect,
  });

  const invitationEmail = buildInvitationEmail(verificationToken);
  await sendEmail(invitedUser.email, invitationEmail.subject, invitationEmail.text, invitationEmail.html);

  usersLogger.info("Invited user to organization", {
    organizationId,
    invitedBy,
    targetUserId: invitedUser.id,
  });

  return invitedUser;
};

export const acceptInvite = async (token: string, password: string): Promise<SanitizedOrgUser> => {
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      organizationId: {
        not: null,
      },
    },
  });

  if (!user) {
    throw new HttpError(400, "Invalid invitation token");
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      isVerified: true,
      verificationToken: null,
    },
    select: orgUserSelect,
  });

  usersLogger.info("Accepted organization invitation", {
    organizationId: updatedUser.organizationId,
    userId: updatedUser.id,
  });

  return updatedUser;
};

export const getOrgUsers = async (organizationId: string): Promise<SanitizedOrgUser[]> => (
  prisma.user.findMany({
    where: { organizationId },
    select: orgUserSelect,
    orderBy: { createdAt: "asc" },
  })
);

export const updateUserRole = async (
  organizationId: string,
  targetUserId: string,
  newRole: UserRole,
): Promise<SanitizedOrgUser> => {
  const targetUser = await prisma.user.findFirst({
    where: {
      id: targetUserId,
      organizationId,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!targetUser) {
    throw new HttpError(404, "User not found in organization");
  }

  if (targetUser.role === UserRole.ADMIN && newRole !== UserRole.ADMIN) {
    await ensureNotLastAdmin(organizationId, targetUserId);
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole },
    select: orgUserSelect,
  });

  usersLogger.info("Updated user role", {
    organizationId,
    userId: targetUserId,
    role: newRole,
  });

  return updatedUser;
};

export const removeUser = async (organizationId: string, targetUserId: string): Promise<void> => {
  await ensureNotLastAdmin(organizationId, targetUserId);

  await prisma.user.deleteMany({
    where: {
      id: targetUserId,
      organizationId,
    },
  });

  usersLogger.info("Removed user from organization", {
    organizationId,
    userId: targetUserId,
  });
};