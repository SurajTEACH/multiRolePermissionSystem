import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { Role } from "../models/Role.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const auth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) throw new ApiError(StatusCodes.UNAUTHORIZED, "Missing access token");

  let payload;
  try {
    payload = jwt.verify(token, env.jwt.accessSecret);
  } catch {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expired token");
  }

  const user = await User.findById(payload.sub).lean();
  if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found");
  if (user.status !== "active") throw new ApiError(StatusCodes.FORBIDDEN, "User disabled");

  const role = await Role.findById(user.roleId).lean();
  if (!role) throw new ApiError(StatusCodes.UNAUTHORIZED, "Role not found");

  req.user = {
    id: String(user._id),
    email: user.email,
    name: user.name,
    roleId: String(user.roleId),
    departmentId: String(user.departmentId),
    permissions: role.permissions || [],
    isSystemRole: !!role.isSystem
  };

  next();
});
