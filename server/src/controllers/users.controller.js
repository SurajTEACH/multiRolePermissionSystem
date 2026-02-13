import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { Role } from "../models/Role.js";
import { Department } from "../models/Department.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const listUsers = asyncHandler(async (req, res) => {
  // Department-based visibility: if user has system.manage -> all
  // else only own department
  const filter = req.user.permissions.includes("system.manage")
    ? {}
    : { departmentId: req.user.departmentId };

  const users = await User.find(filter)
    .select("-passwordHash")
    .populate("roleId", "name isSystem")
    .populate("departmentId", "name code")
    .sort({ createdAt: -1 })
    .lean();

  res.status(StatusCodes.OK).json({ success: true, users });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, roleId, departmentId } = req.body || {};
  if (!name || !email || !password || !roleId || !departmentId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "name, email, password, roleId, departmentId required");
  }

  // Non-system managers can only create users in their own department
  if (!req.user.permissions.includes("system.manage") && String(departmentId) !== req.user.departmentId) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Cannot create user in another department");
  }

  const role = await Role.findById(roleId).lean();
  if (!role) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid roleId");
  const dept = await Department.findById(departmentId).lean();
  if (!dept) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid departmentId");

  const exists = await User.exists({ email: String(email).toLowerCase() });
  if (exists) throw new ApiError(StatusCodes.CONFLICT, "Email already exists");

  const passwordHash = await bcrypt.hash(String(password), env.bcryptSaltRounds);

  const user = await User.create({
    name: String(name),
    email: String(email).toLowerCase(),
    passwordHash,
    roleId,
    departmentId
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    user: { id: String(user._id), name: user.name, email: user.email, roleId, departmentId }
  });
});
