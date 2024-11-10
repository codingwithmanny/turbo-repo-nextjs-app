// Imports
// ============================================================
import { NextResponse, NextRequest } from "next/server";
import { validateSessionToken, sessionTokenName } from "@repo/auth";

// Handlers
// ============================================================
export const GET = async (req: NextRequest) => {
  const sessionToken = req.cookies.get(sessionTokenName)?.value ?? null

  // no cookie exists
  if (!sessionToken) {
    return NextResponse.json({ valid: false })
  }

  const { session } = await validateSessionToken(sessionToken);

  if (!session) {
    return NextResponse.json({ valid: false })
  }

  return NextResponse.json({ valid: true })
};