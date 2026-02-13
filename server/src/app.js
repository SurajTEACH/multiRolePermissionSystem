import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import { corsMiddleware } from "./config/cors.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import { authRouter } from "./routes/auth.routes.js";
import { rolesRouter } from "./routes/roles.routes.js";
import { permissionsRouter } from "./routes/permissions.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { departmentsRouter } from "./routes/departments.routes.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(corsMiddleware);
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(mongoSanitize());
  app.use(morgan("dev"));

  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 120,
      standardHeaders: "draft-7",
      legacyHeaders: false
    })
  );

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRouter);
  app.use("/api/permissions", permissionsRouter);
  app.use("/api/roles", rolesRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/departments", departmentsRouter);

  app.use(errorHandler);
  return app;
}
