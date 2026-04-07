import { createLogger, format, transports } from "winston";

const environment = process.env.NODE_ENV ?? "development";
const logLevel = process.env.LOG_LEVEL ?? (environment === "production" ? "info" : "debug");

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

const logger = createLogger({
  level: logLevel,
  defaultMeta: {
    service: "silo-server",
    environment,
  },
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  transports: [
    new transports.Console({
      format: consoleFormat,
    }),
  ],
  exitOnError: false,
});

export default logger;