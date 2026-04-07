import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";

import { createModuleLogger } from "./config/logger";
import requestContext from "./middleware/request-context";

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

app.get("/health", (request: Request, response: Response) => {
  request.logger.debug("Health check requested");
  response.status(200).json({ status: "ok", requestId: request.requestId });
});

app.use((error: Error, request: Request, response: Response, _next: NextFunction) => {
  const requestLogger = request.logger ?? appLogger;

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