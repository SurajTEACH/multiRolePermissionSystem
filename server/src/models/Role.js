import mongoose from "mongoose";
import { ALL_PERMISSION_KEYS } from "../constants/permissions.js";

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: "" },
    isSystem: { type: Boolean, default: false },
    permissions: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.every((p) => ALL_PERMISSION_KEYS.includes(p)),
        message: "Invalid permission key in role.permissions"
      }
    }
  },
  { timestamps: true }
);

export const Role = mongoose.model("Role", RoleSchema);
