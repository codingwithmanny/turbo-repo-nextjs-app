// Imports
// ============================================================
import { relations, sql } from "drizzle-orm";
import { pgTableCreator, text, timestamp } from "drizzle-orm/pg-core";
// import { text, varchar } from "drizzle-orm/pg-core";
// Table Configurations
// ============================================================
export const createTable = pgTableCreator((name) => `repo_${name}`);

// Tables
// ============================================================
/**
 * Users
 */
export const users = createTable("users", {
  id: text("id").default(sql`gen_random_uuid()`).notNull().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * Sessions
 */
export const sessions = createTable("sessions", {
  id: text("id").default(sql`gen_random_uuid()`).notNull().primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
});
