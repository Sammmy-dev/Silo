import bcrypt from "bcrypt";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { UserRole, type User } from "@prisma/client";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

import { createModuleLogger } from "../../config/logger.js";
import prisma from "../../lib/prisma.js";
import { HttpError } from "../../utils/http-error.js";

const authLogger = createModuleLogger("auth.service");

const ACCESS_TOKEN_EXPIRY = "7d";
const REFRESH_TOKEN_EXPIRY = "30d";
const PASSWORD_SALT_ROUNDS = 12;

type SanitizedUser = {
  id: string;
  organizationId: string | null;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type AuthTokenPayload = {
  id: string;
  organizationId: string | null;
  role: UserRole;
  tokenType: "access" | "refresh";
};

const sanitizeUser = (user: Pick<User, "id" | "organizationId" | "email" | "role" | "isVerified" | "createdAt" | "updatedAt">): SanitizedUser => ({
  id: user.id,
  organizationId: user.organizationId,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is not configured`);
  }

  return value;
};

const getJwtSecrets = () => ({
  accessTokenSecret: getRequiredEnv("JWT_SECRET"),
  refreshTokenSecret: getRequiredEnv("JWT_REFRESH_SECRET"),
});

const signToken = (payload: AuthTokenPayload, secret: string, expiresIn: SignOptions["expiresIn"]): string => (
  jwt.sign(payload, secret, { expiresIn })
);

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

const buildVerificationEmail = (token: string) => {
  const clientUrl = getRequiredEnv("CLIENT_URL");
  const verificationUrl = `${clientUrl.replace(/\/$/, "")}/verify-email?token=${token}`;

  return {
    subject: "Verify your Silo account",
    text: `Welcome to Silo. Verify your account by visiting: ${verificationUrl}`,
    html: `<p>Welcome to Silo.</p><p>Verify your account by clicking <a href="${verificationUrl}">this link</a>.</p>`,
  };
};

const buildResetPasswordEmail = (token: string) => {
  const clientUrl = getRequiredEnv("CLIENT_URL");
  const resetUrl = `${clientUrl.replace(/\/$/, "")}/reset-password?token=${token}`;

  return {
    subject: "Reset your Silo password",
    text: `Reset your password by visiting: ${resetUrl}`,
    html: `<p>You requested a password reset.</p><p>Reset your password by clicking <a href="${resetUrl}">this link</a>.</p>`,
  };
};

const issueTokens = (user: Pick<User, "id" | "organizationId" | "role">) => {
  const { accessTokenSecret, refreshTokenSecret } = getJwtSecrets();

  const accessToken = signToken(
    {
      id: user.id,
      organizationId: user.organizationId,
      role: user.role,
      tokenType: "access",
    },
    accessTokenSecret,
    ACCESS_TOKEN_EXPIRY,
  );

  const refreshToken = signToken(
    {
      id: user.id,
      organizationId: user.organizationId,
      role: user.role,
      tokenType: "refresh",
    },
    refreshTokenSecret,
    REFRESH_TOKEN_EXPIRY,
  );

  return { accessToken, refreshToken };
};

export const register = async (email: string, password: string): Promise<SanitizedUser> => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new HttpError(409, "A user with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
  const verificationToken = uuidv4();

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      role: UserRole.ADMIN,
      isVerified: false,
      verificationToken,
    },
    select: {
      id: true,
      organizationId: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const verificationEmail = buildVerificationEmail(verificationToken);
  await sendEmail(user.email, verificationEmail.subject, verificationEmail.text, verificationEmail.html);

  authLogger.info("Registered new user", { userId: user.id, email: user.email });

  return sanitizeUser(user);
};

export const verifyEmail = async (token: string): Promise<SanitizedUser> => {
  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
    select: {
      id: true,
      organizationId: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new HttpError(400, "Invalid verification token");
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
    },
    select: {
      id: true,
      organizationId: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  authLogger.info("Verified user email", { userId: updatedUser.id });

  return sanitizeUser(updatedUser);
};

export const login = async (email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: SanitizedUser }> => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new HttpError(401, "Invalid email or password");
  }

  if (!user.isVerified) {
    throw new HttpError(403, "Please verify your email before logging in");
  }

  const { accessToken, refreshToken } = issueTokens(user);

  authLogger.info("User logged in", { userId: user.id });

  return {
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  };
};

export const forgotPassword = async (email: string): Promise<void> => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    authLogger.warn("Password reset requested for unknown email", { email: normalizedEmail });
    return;
  }

  const resetToken = uuidv4();
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  const resetEmail = buildResetPasswordEmail(resetToken);
  await sendEmail(user.email, resetEmail.subject, resetEmail.text, resetEmail.html);

  authLogger.info("Issued password reset token", { userId: user.id });
};

export const resetPassword = async (token: string, password: string): Promise<void> => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new HttpError(400, "Invalid or expired reset token");
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  authLogger.info("Reset user password", { userId: user.id });
};

export const refreshToken = async (token: string): Promise<{ accessToken: string }> => {
  const { accessTokenSecret, refreshTokenSecret } = getJwtSecrets();

  let decoded: JwtPayload & AuthTokenPayload;

  try {
    decoded = jwt.verify(token, refreshTokenSecret) as JwtPayload & AuthTokenPayload;
  } catch {
    throw new HttpError(401, "Invalid or expired refresh token");
  }

  if (decoded.tokenType !== "refresh") {
    throw new HttpError(401, "Invalid refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      organizationId: true,
      role: true,
      isVerified: true,
    },
  });

  if (!user || !user.isVerified) {
    throw new HttpError(401, "Invalid refresh token");
  }

  const accessToken = signToken(
    {
      id: user.id,
      organizationId: user.organizationId,
      role: user.role,
      tokenType: "access",
    },
    accessTokenSecret,
    ACCESS_TOKEN_EXPIRY,
  );

  return { accessToken };
};