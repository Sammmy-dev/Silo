import { type NextFunction, type Request, type Response } from "express";

import { HttpError } from "../../utils/http-error.js";
import { acceptInviteSchema, inviteUserSchema, updateRoleSchema } from "./users.schema.js";
import * as usersService from "./users.service.js";

const getOrganizationId = (request: Request): string => {
  if (!request.user?.organizationId) {
    throw new HttpError(404, "Authenticated user does not belong to an organization");
  }

  return request.user.organizationId;
};

const getUserIdParam = (request: Request): string => {
  const { userId } = request.params;

  if (typeof userId !== "string") {
    throw new HttpError(400, "A valid userId route parameter is required");
  }

  return userId;
};

export const getOrgUsers = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const organizationId = getOrganizationId(request);
    const users = await usersService.getOrgUsers(organizationId);

    response.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

export const inviteUser = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    if (!request.user) {
      throw new HttpError(401, "Authentication is required");
    }

    const organizationId = getOrganizationId(request);
    const { email, role } = inviteUserSchema.parse(request.body);
    const user = await usersService.inviteUser(organizationId, request.user.id, email, role);

    response.status(201).json({
      message: "Invitation sent successfully.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptInvite = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, password } = acceptInviteSchema.parse(request.body);
    const user = await usersService.acceptInvite(token, password);

    response.status(200).json({
      message: "Invitation accepted successfully.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const organizationId = getOrganizationId(request);
    const targetUserId = getUserIdParam(request);
    const { role } = updateRoleSchema.parse(request.body);
    const user = await usersService.updateUserRole(organizationId, targetUserId, role);

    response.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const removeUser = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const organizationId = getOrganizationId(request);
    const targetUserId = getUserIdParam(request);
    await usersService.removeUser(organizationId, targetUserId);

    response.status(204).send();
  } catch (error) {
    next(error);
  }
};