"use server"

// Imports
// ========================================================
import { validateSessionToken, invalidateSession } from "@repo/auth";
import { cookies } from "next/headers";

// Main Action
// =================================
export const signOut = async () => {
  try {
    const token = (await cookies()).get("session")?.value ?? "";
    const { session } = await validateSessionToken(token);

    if (!session) {
      return {
        error: "Unauthorized.",
      }
    }

    await invalidateSession(session.id)
    const cookieStore = await cookies();
    cookieStore.delete("session");
    return {
      success: true,
    }
  } catch (error: any) {
    return {
      error: error?.message,
    }
  }
}