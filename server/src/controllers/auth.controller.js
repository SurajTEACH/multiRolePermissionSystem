import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { Role } from "../models/Role.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) throw new ApiError(StatusCodes.BAD_REQUEST, "Email and password required");

  const user = await User.findOne({ email: String(email).toLowerCase() }).lean();
  if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  if (user.status !== "active") throw new ApiError(StatusCodes.FORBIDDEN, "User disabled");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");

  const role = await Role.findById(user.roleId).lean();
  if (!role) throw new ApiError(StatusCodes.UNAUTHORIZED, "Role not found");

  const token = jwt.sign(
    { sub: String(user._id) },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpiresIn }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    accessToken: token,
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      roleId: String(user.roleId),
      departmentId: String(user.departmentId),
      permissions: role.permissions || [],
      isSystemRole: !!role.isSystem
    }
  });
});

export const me = asyncHandler(async (req, res) => {
  res.status(StatusCodes.OK).json({ success: true, user: req.user });
});
