import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError.js";

export const requirePermission = (permissionKey) => (req, _res, next) => {
  const perms = req.user?.permissions || [];
  if (!perms.includes(permissionKey)) {
    throw new ApiError(StatusCodes.FORBIDDEN, `Missing permission: ${permissionKey}`);
  }
  next();
};
