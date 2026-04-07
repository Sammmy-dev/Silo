import "dotenv/config";

import fs from "node:fs";
import path from "node:path";

import { createLogger, format, transports, type Logger, type transport } from "winston";

const environment = process.env.NODE_ENV ?? "development";
const logLevel = process.env.LOG_LEVEL ?? (environment === "production" ? "info" : "debug");
const serviceName = process.env.LOG_SERVICE_NAME ?? "silo-server";

const buildHttpTransport = (): transport | null => {
  const endpoint = process.env.LOG_HTTP_ENDPOINT;

  if (!endpoint) {
    return null;
  }

  const url = new URL(endpoint);
  const auth = process.env.LOG_HTTP_BEARER_TOKEN
    ? { bearer: process.env.LOG_HTTP_BEARER_TOKEN }
    : process.env.LOG_HTTP_USERNAME && process.env.LOG_HTTP_PASSWORD
      ? {
          username: process.env.LOG_HTTP_USERNAME,
          password: process.env.LOG_HTTP_PASSWORD,
        }
      : undefined;

  return new transports.Http({
    level: process.env.LOG_HTTP_LEVEL ?? logLevel,
    host: url.hostname,
    port: url.port ? Number(url.port) : undefined,
    path: `${url.pathname}${url.search}`,
    ssl: url.protocol === "https:",
    auth,
  });
};

const consoleFormat = environment === "production"
  ? format.combine(format.timestamp(), format.errors({ stack: true }), format.json())
  : format.combine(
      format.colorize(),
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.errors({ stack: true }),
      format.printf(({ level, message, timestamp, stack, ...metadata }) => {
        const meta = Object.keys(metadata).length > 0 ? ` ${JSON.stringify(metadata)}` : "";

        return `${timestamp} [${level}] ${stack ?? message}${meta}`;
      }),
    );

const loggerTransports: transport[] = [
  new transports.Console({
    format: consoleFormat,
  }),
];

if (environment === "production") {
  const logDirectory = path.resolve(process.cwd(), process.env.LOG_DIR ?? "logs");

  fs.mkdirSync(logDirectory, { recursive: true });
  loggerTransports.push(
    new transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(logDirectory, "combined.log"),
    }),
  );

  const httpTransport = buildHttpTransport();

  if (httpTransport) {
    loggerTransports.push(httpTransport);
  }
}

const logger = createLogger({
  level: logLevel,
  defaultMeta: {
    service: serviceName,
    environment,
  },
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  transports: loggerTransports,
  exitOnError: false,
});

export const createModuleLogger = (moduleName: string, metadata: Record<string, unknown> = {}): Logger => (
  logger.child({ module: moduleName, ...metadata })
);

export default logger;