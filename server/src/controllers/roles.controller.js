import { StatusCodes } from "http-status-codes";
import { Role } from "../models/Role.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const listRoles = asyncHandler(async (_req, res) => {
  const roles = await Role.find().sort({ createdAt: -1 }).lean();

  // For UI cards: users count + permissions count + created date
  const roleIds = roles.map((r) => r._id);
  const counts = await User.aggregate([
    { $match: { roleId: { $in: roleIds } } },
    { $group: { _id: "$roleId", usersCount: { $sum: 1 } } }
  ]);

  const countMap = new Map(counts.map((c) => [String(c._id), c.usersCount]));

  const data = roles.map((r) => ({
    id: String(r._id),
    name: r.name,
    description: r.description,
    isSystem: !!r.isSystem,
    usersCount: countMap.get(String(r._id)) || 0,
    permissionsCount: (r.permissions || []).length,
    createdAt: r.createdAt
  }));

  res.status(StatusCodes.OK).json({ success: true, roles: data });
});

export const createRole = asyncHandler(async (req, res) => {
  const { name, description, permissions } = req.body || {};
  if (!name) throw new ApiError(StatusCodes.BAD_REQUEST, "Role name required");

  const role = await Role.create({
    name: String(name).trim(),
    description: String(description || ""),
    isSystem: false,
    permissions: Array.isArray(permissions) ? permissions : []
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    role: {
      id: String(role._id),
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
      permissions: role.permissions,
      createdAt: role.createdAt
    }
  });
});

export const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, permissions } = req.body || {};

  const role = await Role.findById(id);
  if (!role) throw new ApiError(StatusCodes.NOT_FOUND, "Role not found");

  // system roles editing optional — here allowed update, but you can lock it:
  // if (role.isSystem) throw new ApiError(StatusCodes.FORBIDDEN, "System role cannot be edited");

  if (name !== undefined) role.name = String(name).trim();
  if (description !== undefined) role.description = String(description);
  if (permissions !== undefined) role.permissions = Array.isArray(permissions) ? permissions : [];

  await role.save();

  res.status(StatusCodes.OK).json({ success: true, role });
});

export const deleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const role = await Role.findById(id);
  if (!role) throw new ApiError(StatusCodes.NOT_FOUND, "Role not found");
  if (role.isSystem) throw new ApiError(StatusCodes.FORBIDDEN, "System role cannot be deleted");

  const inUse = await User.exists({ roleId: role._id });
  if (inUse) throw new ApiError(StatusCodes.CONFLICT, "Role is assigned to users; cannot delete");

  await role.deleteOne();

  res.status(StatusCodes.OK).json({ success: true, message: "Role deleted" });
});

export const getRoleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findById(id).lean();
  if (!role) throw new ApiError(StatusCodes.NOT_FOUND, "Role not found");

  // Users count optional (useful if you want on edit screen)
  const usersCount = await User.countDocuments({ roleId: role._id });

  res.status(StatusCodes.OK).json({
    success: true,
    role: {
      id: String(role._id),
      name: role.name,
      description: role.description,
      isSystem: !!role.isSystem,
      permissions: role.permissions || [],
      permissionsCount: (role.permissions || []).length,
      usersCount,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    }
  });
});

