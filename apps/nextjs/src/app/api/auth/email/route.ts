// Imports
// ============================================================
import jwt from "jsonwebtoken";
import { env } from "@/env";
import { db } from "@repo/db/client";
import { eq } from "@repo/db";
import { NextResponse } from "next/server";
import { magicLinks as magicLinksTable } from "@repo/db/schema";
import { cookies } from "next/headers"
import { createSession, generateSessionToken, sessionTokenName } from "@repo/auth";

// Handlers
// ============================================================
export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || "";

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET!) as {
      email: string;
      userId: string;
      code: string;
      iat: number;
      exp: number;
    };

    const verifiedUser = await db.query.magicLinks.findFirst({
      where: (table) =>
        eq(table.userId, decoded.userId) && eq(table.code, decoded.code),
    });

    if (!verifiedUser) {
      throw Error("Invalid token.");
    }

    await db
      .delete(magicLinksTable)
      .where(eq(magicLinksTable.userId, decoded.userId));


    const sessionToken = await generateSessionToken();
    const session = await createSession(sessionToken, decoded.userId, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    const cookieStore = await cookies();
    cookieStore.set(sessionTokenName, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      expires: session.expiresAt,
      path: "/",
    });

    return NextResponse.redirect(
      `${env.NEXT_PUBLIC_BASE_URL}`
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.redirect(
        `${env.NEXT_PUBLIC_BASE_URL}/auth/error?message=${error.message}`
      );
    }
    return NextResponse.redirect(
      `${env.NEXT_PUBLIC_BASE_URL}/auth/error?message=Invalid token.`
    );
  }
};