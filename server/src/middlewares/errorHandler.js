import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError.js";

export function errorHandler(err, _req, res, _next) {
  const status = err instanceof ApiError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(status).json({
    success: false,
    message: err.message || "Server error",
    details: err.details || undefined
  });
}
