// Imports
// ============================================================
import { drizzle } from "drizzle-orm/node-postgres";
import Database from "pg";
import { env } from "../env";
import * as schema from "./schema";

// Configuration
// ============================================================
const sslOption = env.NODE_ENV === "development" ? false : true;

// Client
// ============================================================
const pgClient = new Database.Pool({
  database: env.DB_NAME,
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  ssl: sslOption,
});

// Exports
// ============================================================
export const db = drizzle(pgClient, { schema });
