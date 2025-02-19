import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";
export function verifyEmailInput(email: string): boolean {
	return /^.+@.+\..+$/.test(email) && email.length < 256;
}

export async function checkEmailAvailability(email: string): boolean {
	const rows = await db.execute(sql`SELECT COUNT(*) as count FROM user WHERE email = ${email}`);
	const row = rows[0];
	if (row === null) {
		throw new Error();
	}
	return row[0].count === 0;
}
