// Imports
// ============================================================
import type { Config } from "drizzle-kit";
import { env } from "./env";

// Config
// ============================================================
export default {
  out: "./drizzle",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  migrations: {
    schema: "public",
  },
  dbCredentials: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: env.NODE_ENV === "development" ? false : true,
  },
} satisfies Config;
