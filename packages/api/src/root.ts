// Imports
// ========================================================
import { postsRouter } from "@/routers/posts";
import { createTRPCRouter, createCallerFactory } from "@/trpc";

// Router
// ========================================================
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsRouter,
});

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

// Types
// ========================================================
// export type definition of API
export type AppRouter = typeof appRouter;