import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { requireSystemManage } from "../middlewares/requireSystemManage.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { listRoles, createRole, updateRole, deleteRole, getRoleById } from "../controllers/roles.controller.js";

export const rolesRouter = Router();

rolesRouter.get("/", auth, requireSystemManage(), listRoles);
rolesRouter.post("/", auth, requireSystemManage(), createRole);
rolesRouter.put("/:id", auth, requireSystemManage(), validateObjectId("id"), updateRole);
rolesRouter.delete("/:id", auth, requireSystemManage(), validateObjectId("id"), deleteRole);
rolesRouter.get("/:id", auth, requireSystemManage(), validateObjectId("id"), getRoleById);
