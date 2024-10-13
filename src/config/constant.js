import "dotenv/config";

export default {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  DB_LOCAL: process.env.DB_LOCAL,
};
