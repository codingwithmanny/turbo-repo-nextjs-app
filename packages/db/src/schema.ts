// Imports
// ============================================================
import { InferSelectModel, relations, sql } from "drizzle-orm";
import { pgTableCreator, text, timestamp } from "drizzle-orm/pg-core";

// Types
// ============================================================
export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;

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

/**
 * Magic Links
 */
export const magicLinks = createTable("magiclinks", {
  id: text("id")
    .default(sql`gen_random_uuid()`)
    .notNull()
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  code: text("code").notNull(),
});

/**
 * Posts
 */
export const posts = createTable("posts", {
  id: text("id").default(sql`gen_random_uuid()`).notNull().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * Sessions Relations
 */
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

/**
 * Posts Relations
 */
export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));
