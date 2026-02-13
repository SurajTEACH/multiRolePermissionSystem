import { requirePermission } from "./requirePermission.js";

export const requireSystemManage = () => requirePermission("system.manage");
