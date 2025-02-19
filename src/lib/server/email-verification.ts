import { generateRandomOTP } from "./utils";
import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";
import { ExpiringTokenBucket } from "./rate-limit";
import { encodeBase32 } from "@oslojs/encoding";

import type { RequestEvent } from "@sveltejs/kit";

export async function getUserEmailVerificationRequest(userId: number, id: string): EmailVerificationRequest | null {
	const rows = await db.execute(sql`
		SELECT id, user_id, code, email, expires_at FROM email_verification_request WHERE id = ${id} AND user_id = ${userId}`);
	const row = rows[0];
	if ((row === null) | (row.length === 0)) {
		return row;
	}
	const request: EmailVerificationRequest = {
		id: row[0].id,
		userId: row[0].userId,
		code: row[0].code,
		email: row[0].email,
		expiresAt: new Date(row[0].expires_at * 1000)
	};
	return request;
}

export async function createEmailVerificationRequest(userId: number, email: string): EmailVerificationRequest {
	deleteUserEmailVerificationRequest(userId);
	const idBytes = new Uint8Array(20);
	crypto.getRandomValues(idBytes);
	const id = encodeBase32(idBytes).toLowerCase();

	const code = generateRandomOTP();
	const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
	await db.execute(sql`
		INSERT INTO email_verification_request (id, user_id, code, email, expires_at) VALUES (${id}, ${userId}, ${code}, ${email}, ${Math.floor(expiresAt.getTime() / 1000)})`);

	const request: EmailVerificationRequest = {
		id,
		userId,
		code,
		email,
		expiresAt
	};
	return request;
}

export async function deleteUserEmailVerificationRequest(userId: number): void {
	await db.execute(sql`DELETE FROM email_verification_request WHERE user_id = ${userId}`);
}

export function sendVerificationEmail(email: string, code: string): void {
	console.log(`To ${email}: Your verification code is ${code}`);
}

export function setEmailVerificationRequestCookie(event: RequestEvent, request: EmailVerificationRequest): void {
	event.cookies.set("email_verification", request.id, {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		expires: request.expiresAt
	});
}

export function deleteEmailVerificationRequestCookie(event: RequestEvent): void {
	event.cookies.set("email_verification", "", {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		maxAge: 0
	});
}

export async function getUserEmailVerificationRequestFromRequest(event: RequestEvent): EmailVerificationRequest | null {
	if (event.locals.user === null) {
		return null;
	}
	const id = event.cookies.get("email_verification") ?? null;
	if (id === null) {
		return null;
	}
	const request = await getUserEmailVerificationRequest(event.locals.user.id, id);
	if (request === null) {
		deleteEmailVerificationRequestCookie(event);
	}
	return request;
}

export const sendVerificationEmailBucket = new ExpiringTokenBucket<number>(3, 60 * 10);

export interface EmailVerificationRequest {
	id: string;
	userId: number;
	code: string;
	email: string;
	expiresAt: Date;
}
