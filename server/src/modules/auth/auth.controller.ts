import { type NextFunction, type Request, type Response } from "express";

import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./auth.schema.js";
import * as authService from "./auth.service.js";

export const register = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = registerSchema.parse(request.body);
    const user = await authService.register(email, password);

    response.status(201).json({
      message: "Registration successful. Please verify your email.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = verifyEmailSchema.parse(request.body);
    const user = await authService.verifyEmail(token);

    response.status(200).json({
      message: "Email verified successfully.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(request.body);
    const result = await authService.login(email, password);

    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = refreshTokenSchema.parse(request.body);
    const result = await authService.refreshToken(token);

    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = forgotPasswordSchema.parse(request.body);
    await authService.forgotPassword(email);

    response.status(200).json({
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, password } = resetPasswordSchema.parse(request.body);
    await authService.resetPassword(token, password);

    response.status(200).json({
      message: "Password reset successfully.",
    });
  } catch (error) {
    next(error);
  }
};