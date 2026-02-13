import { Router } from "express";
import { login, me } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.js";

export const authRouter = Router();

authRouter.post("/login", login);
authRouter.get("/me", auth, me);
