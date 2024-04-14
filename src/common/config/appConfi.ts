import "dotenv/config";

const dbName = "devdb";

export const appConfig = {
  MONGO_URL: process.env.MONGO_URL || `mongodb://localhost:27017${dbName}`,
  SECRET_KEY: process.env.SECRET_KEY,
  REFRESH_KEY: process.env.REFRESH_KEY,
  PORT: process.env.PORT || 5000,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL: process.env.EMAIL,
};
