import dotenv from "dotenv";
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongodbUri: process.env.MONGODB_URI,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1d"
  },
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173"
};

if (!env.mongodbUri) throw new Error("Missing MONGODB_URI in env");
if (!env.jwt.accessSecret) throw new Error("Missing JWT_ACCESS_SECRET in env");
