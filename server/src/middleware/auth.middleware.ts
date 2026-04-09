import jwt, { type JwtPayload } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";

import { HttpError } from "../utils/http-error.js";

type AuthTokenPayload = JwtPayload & {
  id: string;
  organizationId: string | null;
  role: UserRole;
  tokenType: "access" | "refresh";
};

const getAccessTokenSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
};

export const authenticateToken = (request: Request, _response: Response, next: NextFunction): void => {
  const authorizationHeader = request.header("authorization");

  if (!authorizationHeader?.startsWith("Bearer ")) {
    next(new HttpError(401, "Authentication token is required"));
    return;
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();

  try {
    const decoded = jwt.verify(token, getAccessTokenSecret()) as AuthTokenPayload;

    if (decoded.tokenType !== "access") {
      next(new HttpError(401, "Invalid authentication token"));
      return;
    }

    request.user = {
      id: decoded.id,
      organizationId: decoded.organizationId,
      role: decoded.role,
    };
    request.logger = request.logger.child({
      userId: decoded.id,
      organizationId: decoded.organizationId,
      role: decoded.role,
    });

    next();
  } catch {
    next(new HttpError(401, "Invalid or expired authentication token"));
  }
};

export const requireRole = (...roles: UserRole[]) => (
  request: Request,
  _response: Response,
  next: NextFunction,
): void => {
  if (!request.user) {
    next(new HttpError(401, "Authentication is required"));
    return;
  }

  if (!roles.includes(request.user.role)) {
    next(new HttpError(403, "You do not have permission to perform this action"));
    return;
  }

  next();
};