import { StatusCodes } from "http-status-codes";

export class ApiError extends Error {
  constructor(statusCode = StatusCodes.INTERNAL_SERVER_ERROR, message = "Something went wrong", details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}
