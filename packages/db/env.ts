/* eslint-disable no-restricted-properties */
// Imports
// ============================================================
import { createEnv } from "@t3-oss/env-core"
import { z } from "zod";

// Environment Variables
// ============================================================
export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    DB_HOST: z.string().min(1),
    DB_PORT: z.coerce.number().default(5432),
    DB_USERNAME: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_NAME: z.string().min(1),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
  },
  /**
   * Skip validation in production
   */
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
