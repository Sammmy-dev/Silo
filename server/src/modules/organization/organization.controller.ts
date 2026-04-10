import { type NextFunction, type Request, type Response } from "express";

import { HttpError } from "../../utils/http-error.js";
import { createOrganizationSchema, updateOrganizationSchema } from "./organization.schema.js";
import * as organizationService from "./organization.service.js";

export const createOrganization = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    if (!request.user) {
      throw new HttpError(401, "Authentication is required");
    }

    if (request.user.organizationId) {
      throw new HttpError(409, "User already belongs to an organization");
    }

    const data = createOrganizationSchema.parse(request.body);
    const result = await organizationService.createOrganization(request.user.id, data);

    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyOrganization = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    if (!request.user?.organizationId) {
      throw new HttpError(404, "Authenticated user does not belong to an organization");
    }

    const organization = await organizationService.getOrganization(request.user.organizationId);

    response.status(200).json({ organization });
  } catch (error) {
    next(error);
  }
};

export const updateMyOrganization = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    if (!request.user?.organizationId) {
      throw new HttpError(404, "Authenticated user does not belong to an organization");
    }

    const data = updateOrganizationSchema.parse(request.body);
    const organization = await organizationService.updateOrganization(request.user.organizationId, data);

    response.status(200).json({ organization });
  } catch (error) {
    next(error);
  }
};