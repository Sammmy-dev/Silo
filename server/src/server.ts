import dotenv from "dotenv";

import app from "./app";
import logger from "./config/logger";

dotenv.config();

const port = Number(process.env.PORT) || 4000;

process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught exception", {
    errorMessage: error.message,
    stack: error.stack,
  });

  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  logger.error("Unhandled promise rejection", {
    reason: reason instanceof Error
      ? { message: reason.message, stack: reason.stack }
      : reason,
  });
});

app.listen(port, () => {
  logger.info("Server started", { port });
});