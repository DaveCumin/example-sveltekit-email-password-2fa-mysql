import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { generateRandomOTP } from "./utils";
import { sha256 } from "@oslojs/crypto/sha2";

import type { RequestEvent } from "@sveltejs/kit";
import type { User } from "./user";

export async function createPasswordResetSession(token: string, userId: number, email: string): PasswordResetSession {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: PasswordResetSession = {
		id: sessionId,
		userId,
		email,
		expiresAt: new Date(Date.now() + 1000 * 60 * 10),
		code: generateRandomOTP(),
		emailVerified: false,
		twoFactorVerified: false
	};
	await db.execute(
		sql`INSERT INTO password_reset_session (id, user_id, email, code, expires_at) VALUES (${session.id}, ${session.userId}, ${session.email}, ${session.code}, ${Math.floor(session.expiresAt.getTime() / 1000)})`
	);
	return session;
}

export async function validatePasswordResetSessionToken(token: string): PasswordResetSessionValidationResult {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const rows = await db.execute(sql`
		SELECT password_reset_session.id, password_reset_session.user_id, password_reset_session.email, password_reset_session.code, password_reset_session.expires_at, password_reset_session.email_verified, password_reset_session.two_factor_verified,
user.id, user.email, user.username, user.email_verified, user.totp_key, 1, 0)
FROM password_reset_session INNER JOIN user ON user.id = password_reset_session.user_id
WHERE password_reset_session.id = ${sessionId}`);
	const row = rows[0];
	if ((row === null) | (row.length === 0)) {
		return { session: null, user: null };
	}
	const session: PasswordResetSession = {
		id: row[0].id,
		userId: row[0].user.id,
		email: row[0].email,
		code: row[0].code,
		expiresAt: new Date(row[0].password_reset_session.expires_at * 1000),
		emailVerified: Boolean(row[0].password_reset_session.email_verified),
		twoFactorVerified: Boolean(row[0].password_reset_session.two_factor_verified)
	};
	const user: User = {
		id: row[0].user.id,
		email: row[0].user.email,
		username: user.username,
		emailVerified: Boolean(row[0].user.email_verified),
		registered2FA: Boolean(row[0].user.totp_key != null)
	};
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.execute(sql`DELETE FROM password_reset_session WHERE id = ${session.id}`);
		return { session: null, user: null };
	}
	return { session, user };
}

export async function setPasswordResetSessionAsEmailVerified(sessionId: string): void {
	await db.execute(sql`UPDATE password_reset_session SET email_verified = 1 WHERE id = ${sessionId}`);
}

export async function setPasswordResetSessionAs2FAVerified(sessionId: string): void {
	await db.execute(sql`UPDATE password_reset_session SET two_factor_verified = 1 WHERE id = ${sessionId}`);
}

export async function invalidateUserPasswordResetSessions(userId: number): void {
	await db.execute(sql`DELETE FROM password_reset_session WHERE user_id = ${userId}`);
}

export async function validatePasswordResetSessionRequest(event: RequestEvent): PasswordResetSessionValidationResult {
	const token = event.cookies.get("password_reset_session") ?? null;
	if (token === null) {
		return { session: null, user: null };
	}
	const result = await validatePasswordResetSessionToken(token);
	if (result.session === null) {
		deletePasswordResetSessionTokenCookie(event);
	}
	return result;
}

export function setPasswordResetSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set("password_reset_session", token, {
		expires: expiresAt,
		sameSite: "lax",
		httpOnly: true,
		path: "/",
		secure: !import.meta.env.DEV
	});
}

export function deletePasswordResetSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set("password_reset_session", "", {
		maxAge: 0,
		sameSite: "lax",
		httpOnly: true,
		path: "/",
		secure: !import.meta.env.DEV
	});
}

export function sendPasswordResetEmail(email: string, code: string): void {
	console.log(`To ${email}: Your reset code is ${code}`);
}

export interface PasswordResetSession {
	id: string;
	userId: number;
	email: string;
	expiresAt: Date;
	code: string;
	emailVerified: boolean;
	twoFactorVerified: boolean;
}

export type PasswordResetSessionValidationResult =
	| { session: PasswordResetSession; user: User }
	| { session: null; user: null };
