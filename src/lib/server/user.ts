import { db } from "$lib/server/db";
import { is, sql } from "drizzle-orm";
import { decrypt, decryptToString, encrypt, encryptString } from "./encryption";
import { hashPassword } from "./password";
import { generateRandomRecoveryCode } from "./utils";
import { encodeBase32 } from "@oslojs/encoding";

export function verifyUsernameInput(username: string): boolean {
	return username.length > 3 && username.length < 32 && username.trim() === username;
}

export async function createUser(email: string, username: string, password: string): Promise<User> {
	const passwordHash = await hashPassword(password);
	const recoveryCode = generateRandomRecoveryCode();
	const encryptedRecoveryCode = encryptString(recoveryCode);

	const idBytes = new Uint8Array(20);
	crypto.getRandomValues(idBytes);
	const id = encodeBase32(idBytes).toLowerCase();

	const rows = await db.execute(sql`
		INSERT INTO user (id, email, username, password_hash, recovery_code) VALUES (${id}, ${email}, ${username}, ${passwordHash}, '${encryptedRecoveryCode}')`);
	const row = rows[0];
	if ((row === null) | (row.length === 0)) {
		throw new Error("Unexpected error");
	}
	const user: User = {
		id: id,
		username,
		email,
		emailVerified: false,
		registered2FA: true //false
	};
	return user;
}

export async function updateUserPassword(userId: number, password: string): Promise<void> {
	const passwordHash = await hashPassword(password);
	await db.execute(sql`UPDATE user SET password_hash = ${passwordHash} WHERE id = ${userId}`);
}

export async function updateUserEmailAndSetEmailAsVerified(userId: number, email: string): void {
	await db.execute(sql`UPDATE user SET email = ${email}, email_verified = 1 WHERE id = ${userId}`);
}

export async function setUserAsEmailVerifiedIfEmailMatches(userId: number, email: string): boolean {
	const result = await db.execute(sql`UPDATE user SET email_verified = 1 WHERE id = ${userId} AND email = ${email}`);
	return result.changes > 0;
}

export async function getUserPasswordHash(userId: number): string {
	const rows = await db.execute(sql`SELECT password_hash FROM user WHERE id = ${userId}`);
	const row = rows[0];
	if ((row === null) | (row.length === 0)) {
		throw new Error("Invalid user ID");
	}

	return row[0].password_hash;
}

export async function getUserRecoverCode(userId: number): string {
	const rows = await db.execute(sql`SELECT recovery_code FROM user WHERE id = ${userId}`);
	const row = rows[0];
	if ((row === null) | (row.length === 0)) {
		throw new Error("Invalid user ID");
	}
	return decryptToString(row.bytes(0));
}

export async function getUserTOTPKey(userId: number): Uint8Array | null {
	const rows = await db.execute(sql`SELECT totp_key FROM user WHERE id = ${userId}`);
	const row = rows[0];
	if ((row === null) | (row.length === 0)) {
		throw new Error("Invalid user ID");
	}
	const encrypted = row.bytesNullable(0);
	if (encrypted === null) {
		return null;
	}
	return decrypt(encrypted);
}

export async function updateUserTOTPKey(userId: number, key: Uint8Array): void {
	const encrypted = encrypt(key);
	await db.execute(sql`UPDATE user SET totp_key = ${encrypted} WHERE id = ${userId}`);
}

export async function resetUserRecoveryCode(userId: number): string {
	const recoveryCode = generateRandomRecoveryCode();
	const encrypted = encryptString(recoveryCode);
	await db.execute(sql`UPDATE user SET recovery_code = ${encrypted} WHERE id = ${userId}`);
	return recoveryCode;
}

export async function getUserFromEmail(email: string): User | null {
	const rows = await db.execute(sql`
		SELECT id, email, username, email_verified, totp_key FROM user WHERE email = ${email}`);
	const row = rows[0];
	if ((row === null) | (row.length === 0)) {
		return null;
	}
	const user: User = {
		id: row[0].id,
		email: row[0].email,
		username: row[0].username,
		emailVerified: Boolean(row[0].email_verified),
		registered2FA: Boolean(row[0].totp_key != null)
	};
	return user;
}

export interface User {
	id: number;
	email: string;
	username: string;
	emailVerified: boolean;
	registered2FA: boolean;
}
