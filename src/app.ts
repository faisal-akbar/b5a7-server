import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import expressSession from "express-session";
import { envVars } from "./app/config/env";
import { ensureDbConnection } from "./app/middlewares/dbConnection";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";

const app = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);

// Apply database connection middleware to all API routes
app.use("/api/v1", ensureDbConnection, router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Portfolio Backend",
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
