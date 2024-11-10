// Imports
// ========================================================
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/trpc";
import { posts } from "@repo/db/schema";
import { eq, and } from "@repo/db";

// Router
// ========================================================
export const postsRouter = createTRPCRouter({
  /**
   * This is a public route that returns all posts.
   */
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.posts.findMany();
  }),
  /**
   * This is a protected route that creates a post.
   */
  create: protectedProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(posts).values({
        title: input.title,
        content: input.content,
        userId: ctx.session.user.id,
      });
    }),
  /**
   * This is a protected route that updates a post.
   */
  update: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.update(posts)
        .set({ title: input.title, content: input.content })
        .where(and(eq(posts.id, input.id), eq(posts.userId, ctx.session.user.id)));
    }),
  /**
   * This is a protected route that deletes a post.
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(posts).where(
        and(eq(posts.id, input.id), eq(posts.userId, ctx.session.user.id))
      );
    }),
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  // create: protectedProcedure
  //   .input(z.object({ title: z.string().min(1), content: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     await ctx.db.insert(posts).values({
  //       title: input.title,
  //       content: input.content,
  //       // createdById: ctx.session.user.id,
  //     });
  //   }),

  // getLatest: protectedProcedure.query(async ({ ctx }) => {
  //   const post = await ctx.db.query.posts.findFirst({
  //     orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  //   });

  //   return post ?? null;
  // }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});
