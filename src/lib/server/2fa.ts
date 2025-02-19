import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";

import { decryptToString, encryptString } from "./encryption";
import { ExpiringTokenBucket } from "./rate-limit";
import { generateRandomRecoveryCode } from "./utils";

export const totpBucket = new ExpiringTokenBucket<number>(5, 60 * 30);
export const recoveryCodeBucket = new ExpiringTokenBucket<number>(3, 60 * 60);

export async function resetUser2FAWithRecoveryCode(userId: number, recoveryCode: string): boolean {
	// Note: In Postgres and MySQL, these queries should be done in a transaction using SELECT FOR UPDATE
	const rows = await db.execute(sql`SELECT recovery_code FROM user WHERE id = ${userId}`);
	const row = rows[0];
	if ((row === null) | (row.length === 0)) {
		return false;
	}
	const encryptedRecoveryCode = row.recovery_code;
	const userRecoveryCode = decryptToString(encryptedRecoveryCode);
	const recoveryCodeBuffer = Buffer.from(encryptedRecoveryCode);

	if (recoveryCode !== userRecoveryCode) {
		return false;
	}

	const newRecoveryCode = generateRandomRecoveryCode();
	const encryptedNewRecoveryCode = encryptString(newRecoveryCode);
	const encryptedNewRecoveryCodeBuffer = Buffer.from(encryptedNewRecoveryCode);

	await db.execute(sql`UPDATE session SET two_factor_verified = 0 WHERE user_id = ${userId}`);
	// Compare old recovery code to ensure recovery code wasn't updated.
	const result = await db.execute(
		sql`UPDATE user SET recovery_code = ${sql.raw("x'" + encryptedNewRecoveryCodeBuffer.toString("hex") + "'")}, totp_key = NULL WHERE id = ${userId} AND recovery_code = ${sql.raw("x'" + recoveryCodeBuffer.toString("hex") + "'")}`
	);

	return result.changes > 0;
}
