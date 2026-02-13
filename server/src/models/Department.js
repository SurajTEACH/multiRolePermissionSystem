import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, unique: true }
  },
  { timestamps: true }
);

export const Department = mongoose.model("Department", DepartmentSchema);
