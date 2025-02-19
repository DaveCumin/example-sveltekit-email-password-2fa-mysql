import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import type { User } from "./user";
import type { RequestEvent } from "@sveltejs/kit";

export async function validateSessionToken(token: string): SessionValidationResult {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const rows = await db.execute(sql`
SELECT 
    session.id AS session_id, 
    session.user_id, 
    session.expires_at, 
    session.two_factor_verified, 
    user.id AS user_id, 
    user.email, 
    user.username, 
    user.email_verified, 
    user.totp_key 
FROM session
INNER JOIN user ON session.user_id = user.id
WHERE session.id = ${sessionId}
`);
	const row = rows[0];
	if (row === null || row.length === 0) {
		return { session: null, user: null };
	}

	const session: Session = {
		id: row[0].session_id,
		userId: row[0].user_id,
		expiresAt: new Date(row[0].expires_at * 1000),
		twoFactorVerified: Boolean(row[0].two_factor_verified)
	};
	const user: User = {
		id: row[0].user_id,
		email: row[0].email,
		username: row[0].username,
		emailVerified: Boolean(row[0].email_verified),
		registered2FA: Boolean(row[0].totp_key != null)
	};

	if (Date.now() >= session.expiresAt.getTime()) {
		await db.execute(sql`DELETE FROM session WHERE id = ${session.id}`);
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db.execute(
			sql`UPDATE session SET expires_at = ${Math.floor(session.expiresAt.getTime() / 1000)} WHERE session.id = ${session.id}`
		);
	}
	return { session, user };
}

export async function invalidateSession(sessionId: string): void {
	await db.execute(sql`DELETE FROM session WHERE id = ${sessionId}`);
}

export async function invalidateUserSessions(userId: number): void {
	await db.execute(sql`DELETE FROM session WHERE user_id = ${userId}`);
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set("session", token, {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		expires: expiresAt
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set("session", "", {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		maxAge: 0
	});
}

export function generateSessionToken(): string {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
	return token;
}

export async function createSession(token: string, userId: number, flags: SessionFlags): Session {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		twoFactorVerified: flags.twoFactorVerified
	};
	await db.execute(
		sql`INSERT INTO session (id, user_id, expires_at, two_factor_verified) VALUES (${session.id}, ${session.userId}, ${Math.floor(session.expiresAt.getTime() / 1000)}, ${Number(session.twoFactorVerified)})`
	);
	return session;
}

export async function setSessionAs2FAVerified(sessionId: string): void {
	await db.execute(sql`UPDATE session SET two_factor_verified = 1 WHERE id = ${sessionId}`);
}

export interface SessionFlags {
	twoFactorVerified: boolean;
}

export interface Session extends SessionFlags {
	id: string;
	expiresAt: Date;
	userId: number;
}

type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };
