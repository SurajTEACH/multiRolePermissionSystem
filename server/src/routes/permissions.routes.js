import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { listPermissionGroups } from "../controllers/permissions.controller.js";

export const permissionsRouter = Router();

permissionsRouter.get("/", auth, listPermissionGroups);
