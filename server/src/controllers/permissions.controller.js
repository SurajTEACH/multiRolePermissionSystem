import { StatusCodes } from "http-status-codes";
import { PERMISSION_GROUPS } from "../constants/permissions.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listPermissionGroups = asyncHandler(async (_req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    groups: PERMISSION_GROUPS
  });
});
