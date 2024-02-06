import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { posts, users } from "@/server/db/schema";
import { db } from "@/server/db";

export const userRouter = createTRPCRouter({
  // getUser: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  create: publicProcedure
    .input(z.object({ email: z.string().min(1), password: z.string().min(1), username: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(users).values({
        id: crypto.randomUUID(),
        email: input.email,
        password: input.password,
        username: input.username
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),
});


/*

// create a user
const user = await db.insert(users).values({
  name: 'Nilu',
  email: 'nilu@prisma.io',
})

// update a user
const user = await db
  .update(users)
  .set({ name: 'Another Nilu' })
  .where(eq(users.email, 'nilu@prisma.io'))
  .returning()

// delete a user
const deletedUser = await db
  .delete(users)
  .where(eq(users.email, 'nilu@prisma.io'))
  .returning()

  // case sensitive filter
const posts = await db
  .select()
  .from(posts)
  .where(like(posts.title, 'Hello World'))

// case insensitive filter
const posts = await db
  .select()
  .from(posts)
  .where(ilike(posts.title, 'Hello World'))

  // contains
  const posts = await db
  .select()
  .from(posts)
  .where(ilike(posts.title, '%Hello World%'))

  // starts with
  const posts = await db
  .select()
  .from(posts)
  .where(ilike(posts.title, 'Hello World%'))

  // ends with
  const posts = await db
  .select()
  .from(posts)
  .where(ilike(posts.title, '%Hello World'))

  // limit-offset pagination (cursor-based not currently possible)
  const postPage = await db
  .select()
  .from(users)
  .where(ilike(posts.title, 'Hello World%'))
  .limit(3)
  .offset(6)
  */