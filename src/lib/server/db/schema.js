import { mysqlTable, int, bigint, text, binary, varchar, index } from "drizzle-orm/mysql-core";

export const user = mysqlTable(
	"user",
	{
		id: varchar("id", { length: 255 }).notNull().primaryKey(),
		email: varchar("email", { length: 255 }).notNull().unique(),
		username: varchar("username", { length: 255 }).notNull(),
		passwordHash: varchar("password_hash", { length: 255 }).notNull(),
		emailVerified: int("email_verified").notNull().default(0),
		totpKey: binary("totp_key", { length: 64 }), // Define expected size
		recoveryCode: binary("recovery_code", { length: 64 }).notNull() // Define expected size
	},
	(table) => ({
		emailIndex: index("email_index").on(table.email)
	})
);

export const session = mysqlTable("session", {
	id: varchar("id", { length: 255 }).notNull().primaryKey(),
	userId: varchar("user_id", { length: 255 })
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	expiresAt: bigint("expires_at", { mode: "number" }).notNull(),
	twoFactorVerified: int("two_factor_verified").notNull().default(0)
});

export const emailVerificationRequest = mysqlTable("email_verification_request", {
	id: varchar("id", { length: 255 }).notNull().primaryKey(),
	userId: varchar("user_id", { length: 255 })
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	email: varchar("email", { length: 255 }).notNull(),
	code: varchar("code", { length: 255 }).notNull(),
	expiresAt: bigint("expires_at", { mode: "number" }).notNull()
});

export const passwordResetSession = mysqlTable("password_reset_session", {
	id: varchar("id", { length: 255 }).notNull().primaryKey(),
	userId: varchar("user_id", { length: 255 })
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	email: varchar("email", { length: 255 }).notNull(),
	code: varchar("code", { length: 255 }).notNull(),
	expiresAt: bigint("expires_at", { mode: "number" }).notNull(),
	emailVerified: int("email_verified").notNull().default(0),
	twoFactorVerified: int("two_factor_verified").notNull().default(0)
});

export const userlog = mysqlTable("user_log", {
	id: varchar("id", { length: 255 }).notNull().primaryKey(),
	userId: varchar("user_id", { length: 255 })
		.notNull()
		.references(() => user.id),
	event: varchar("event", { length: 255 }).notNull(),
	eventtime: bigint("eventtime", { mode: "number" }).notNull()
});
