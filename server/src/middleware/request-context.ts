import { randomUUID } from "node:crypto";

import { type NextFunction, type Request, type Response } from "express";

import { createModuleLogger } from "../config/logger";

const requestLogger = createModuleLogger("http.request");

const requestContext = (request: Request, response: Response, next: NextFunction): void => {
  const requestId = request.header("x-request-id") ?? randomUUID();
  const startedAt = process.hrtime.bigint();

  request.requestId = requestId;
  request.logger = requestLogger.child({
    requestId,
    method: request.method,
    path: request.originalUrl || request.url,
  });

  response.setHeader("x-request-id", requestId);

  response.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    request.logger.http("Request completed", {
      statusCode: response.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      contentLength: response.getHeader("content-length") ?? null,
      userAgent: request.get("user-agent") ?? null,
      ip: request.ip,
    });
  });

  next();
};

export default requestContext;