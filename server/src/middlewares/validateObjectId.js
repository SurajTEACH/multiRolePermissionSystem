import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError.js";

export const validateObjectId = (paramName) => (req, _res, next) => {
  const val = req.params[paramName];
  if (!mongoose.Types.ObjectId.isValid(val)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Invalid ObjectId: ${paramName}`);
  }
  next();
};
