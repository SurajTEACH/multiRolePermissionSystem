import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { Department } from "../models/Department.js";
import { Role } from "../models/Role.js";
import { User } from "../models/User.js";
import { ALL_PERMISSION_KEYS } from "../constants/permissions.js";

async function seed() {
  await connectDB();

  // clean (optional)
  await Promise.all([User.deleteMany({}), Role.deleteMany({}), Department.deleteMany({})]);

  const departments = await Department.insertMany([
    { name: "Administration", code: "ADMIN" },
    { name: "Sales", code: "SALES" },
    { name: "Operations", code: "OPS" }
  ]);

  const adminDept = departments.find((d) => d.code === "ADMIN");

  const roles = await Role.insertMany([
    {
      name: "Admin",
      description: "Full system access with all administrative privileges",
      isSystem: true,
      permissions: ALL_PERMISSION_KEYS
    },
    {
      name: "Manager",
      description: "Team management and assignment capabilities",
      isSystem: true,
      permissions: ["users.view", "leads.view", "leads.update", "properties.view", "activities.view", "reports.view"]
    },
    {
      name: "Agent",
      description: "Sales agent with lead and property management",
      isSystem: true,
      permissions: ["leads.create", "leads.view", "activities.create", "activities.view", "properties.view"]
    },
    {
      name: "Seller",
      description: "Property owners who list properties",
      isSystem: true,
      permissions: ["properties.create", "properties.view", "properties.update"]
    },
    {
      name: "Buyer",
      description: "Property buyers with limited access",
      isSystem: true,
      permissions: ["properties.view"]
    }
  ]);

  const adminRole = roles.find((r) => r.name === "Admin");

  const passwordHash = await bcrypt.hash("Admin@123", env.bcryptSaltRounds);

  await User.create({
    name: "System Admin",
    email: "admin@example.com",
    passwordHash,
    roleId: adminRole._id,
    departmentId: adminDept._id,
    status: "active"
  });

  console.log("Seed completed:");
  console.log("Admin login: admin@example.com / Admin@123");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
