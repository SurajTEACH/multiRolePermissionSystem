import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    status: { type: String, enum: ["active", "disabled"], default: "active" }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
