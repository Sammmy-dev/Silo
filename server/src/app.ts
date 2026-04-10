import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import { ZodError } from "zod";

import { createModuleLogger } from "./config/logger.js";
import requestContext from "./middleware/request-context.js";
import authRouter from "./modules/auth/auth.router.js";
import organizationRouter from "./modules/organization/organization.router.js";
import usersRouter from "./modules/users/users.router.js";
import { HttpError } from "./utils/http-error.js";

const appLogger = createModuleLogger("app");

const app = express();
const clientUrl = process.env.CLIENT_URL;

app.use(
  cors({
    origin: clientUrl ?? false,
    credentials: true,
  }),
);
app.use(helmet());
app.use(requestContext);
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/organizations", organizationRouter);
app.use("/api/users", usersRouter);

app.get("/health", (request: Request, response: Response) => {
  request.logger.debug("Health check requested");
  response.status(200).json({ status: "ok", requestId: request.requestId });
});

app.use((error: Error, request: Request, response: Response, _next: NextFunction) => {
  const requestLogger = request.logger ?? appLogger;

  if (error instanceof ZodError) {
    requestLogger.warn("Validation error", {
      issues: error.flatten(),
    });

    response.status(400).json({
      message: "Validation failed",
      errors: error.flatten(),
    });
    return;
  }

  if (error instanceof HttpError) {
    requestLogger.warn("Request failed", {
      statusCode: error.statusCode,
      errorMessage: error.message,
      details: error.details,
    });

    response.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
    return;
  }

  requestLogger.error("Unhandled application error", {
    method: request.method,
    path: request.originalUrl,
    errorMessage: error.message,
    stack: error.stack,
  });

  response.status(500).json({
    message: "Internal server error",
  });
});

export default app;