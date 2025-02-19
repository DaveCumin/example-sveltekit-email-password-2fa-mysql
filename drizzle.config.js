import { defineConfig } from "drizzle-kit";
if (!process.env.USER_DATABASE_URL) throw new Error("USER_DATABASE_URL is not set");

export default defineConfig({
	schema: "./src/lib/server/db/schema.js",

	dbCredentials: {
		url: process.env.USER_DATABASE_URL
	},

	verbose: true,
	strict: true,
	dialect: "mysql"
});
if (!process.env.USER_DATABASE_URL) throw new Error("USER_DATABASE_URL is not set");
