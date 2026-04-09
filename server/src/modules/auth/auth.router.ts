import { Router } from "express";
import rateLimit from "express-rate-limit";

import * as authController from "./auth.controller.js";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication requests. Please try again later.",
  },
});

const authRouter = Router();

authRouter.use(authLimiter);

authRouter.post("/register", authController.register);
authRouter.post("/verify-email", authController.verifyEmail);
authRouter.post("/login", authController.login);
authRouter.post("/google", authController.googleSignIn);
authRouter.post("/refresh", authController.refreshToken);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);

export default authRouter;