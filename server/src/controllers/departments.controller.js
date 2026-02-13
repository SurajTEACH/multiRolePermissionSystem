import { StatusCodes } from "http-status-codes";
import { Department } from "../models/Department.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const listDepartments = asyncHandler(async (_req, res) => {
  const depts = await Department.find().sort({ name: 1 }).lean();
  res.status(StatusCodes.OK).json({ success: true, departments: depts });
});

export const createDepartment = asyncHandler(async (req, res) => {
  const { name, code } = req.body || {};
  if (!name || !code) throw new ApiError(StatusCodes.BAD_REQUEST, "name and code required");

  const dept = await Department.create({ name: String(name), code: String(code).toUpperCase() });
  res.status(StatusCodes.CREATED).json({ success: true, department: dept });
});
