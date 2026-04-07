import app from "./app";
import { createModuleLogger } from "./config/logger";

const serverLogger = createModuleLogger("server");

const port = Number(process.env.PORT) || 4000;

process.on("uncaughtException", (error: Error) => {
  serverLogger.error("Uncaught exception", {
    errorMessage: error.message,
    stack: error.stack,
  });

  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  serverLogger.error("Unhandled promise rejection", {
    reason: reason instanceof Error
      ? { message: reason.message, stack: reason.stack }
      : reason,
  });
});

app.listen(port, () => {
  serverLogger.info("Server started", { port });
});