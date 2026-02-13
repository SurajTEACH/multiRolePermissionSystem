import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { requireSystemManage } from "../middlewares/requireSystemManage.js";
import { listDepartments, createDepartment } from "../controllers/departments.controller.js";

export const departmentsRouter = Router();

departmentsRouter.get("/", auth, listDepartments);
departmentsRouter.post("/", auth, requireSystemManage(), createDepartment);
