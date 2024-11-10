"use server";

// Imports
// ============================================================
import { eq } from "@repo/db";
import { db } from "@repo/db/client";
import { users as usersTable, magicLinks as magicLinksTable } from "@repo/db/schema";
import jwt from "jsonwebtoken";
import { env } from "@/env";
import { sendEmail } from "@/lib/email";

// Main Action
// ========================================================
// export const signUp = async (values: z.infer<typeof FormSchemaSignUp>) => {
export const signUp = async (values: { name: string; email: string }) => {
  try {
    const existingUser = await db.query.users.findFirst({
      where: (table) => eq(table.email, values.email),
    });

    let userId = existingUser?.id ?? "";

    if (!existingUser) {
      const createUser = await db
        .insert(usersTable)
        .values({
          name: values.name,
          email: values.email,
        })
        .returning({
          id: usersTable.id,
          email: usersTable.email,
        });

      userId = createUser?.[0]?.id ?? "";
    }

    // Generate email code
    const code = Math.random().toString(36).substring(2, 8);

    const token = jwt.sign(
      { email: values.email, userId, code },
      env.JWT_SECRET!,
      {
        expiresIn: "5m",
      }
    );

    // Store in database
    await db.insert(magicLinksTable).values({
      userId,
      code: code,
    });

    const url = `${env.NEXT_PUBLIC_BASE_URL}/api/auth/email?token=${token}`;

    await sendEmail({
      to: values.email,
      subject: "Sign in to your account",
      html: `<p>Click here to sign in:<br/><a href="${url}">${url}</a></p>`,
    });

    return {
      success: true,
      data: {
        userId,
      },
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error?.message,
      };
    }

    return {
      error: "An unknown error occurred",
    };
  }
};
