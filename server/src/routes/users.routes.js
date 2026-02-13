import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { requirePermission } from "../middlewares/requirePermission.js";
import { listUsers, createUser } from "../controllers/users.controller.js";

export const usersRouter = Router();

usersRouter.get("/", auth, requirePermission("users.view"), listUsers);
usersRouter.post("/", auth, requirePermission("users.create"), createUser);
