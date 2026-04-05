import cors from "cors";
import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

const app = express();
const clientUrl = process.env.CLIENT_URL;

app.use(
  cors({
    origin: clientUrl ?? false,
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_request: Request, response: Response) => {
  response.status(200).json({ status: "ok" });
});

app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
  console.error(error);

  response.status(500).json({
    message: "Internal server error",
  });
});

export default app;