// Imports
// ============================================================
import { db } from "@repo/db/client";
import { eq } from "@repo/db";
import { users as usersTable, sessions as sessionTable, type User, type Session } from "@repo/db/schema";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

// Types
// ============================================================
export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

// Session Functions
// ============================================================
/**
 * Session cookie name
 */
export const sessionTokenName = "session";

/**
 * Generate a session token
 * @returns Session token
 */
export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
};

/**
 * Create a session
 * @param token - Session token
 * @param userId - User ID
 * @returns Session
 */
export async function createSession(token: string, userId: number | string, options: { expiresIn: number }): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId: userId.toString(),
		expiresAt: new Date(Date.now() + 1000 * options.expiresIn)
	};
	await db.insert(sessionTable).values(session);
	return session;
};

/**
 * Validate a session token
 * @param token - Session token
 * @returns Session validation result
 */
export async function validateSessionToken(token?: string | null): Promise<SessionValidationResult> {
	if (!token) {
		return { session: null, user: null };
	}
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await db
		.select({ user: usersTable, session: sessionTable })
		.from(sessionTable)
		.innerJoin(usersTable, eq(sessionTable.userId, usersTable.id))
		.where(eq(sessionTable.id, sessionId));
	if (result.length < 1) {
		return { session: null, user: null };
	}
	const { user, session } = result[0]!;
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db
			.update(sessionTable)
			.set({
				expiresAt: session.expiresAt
			})
			.where(eq(sessionTable.id, session.id));
	}
	return { session, user };
};

/**
 * Invalidate a session
 * @param sessionId - Session ID
 */
export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
};