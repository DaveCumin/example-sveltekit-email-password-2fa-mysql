import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "$env/dynamic/private";
if (!env.USER_DATABASE_URL) throw new Error("USER_DATABASE_URL is not set");
const client = await mysql.createConnection(env.USER_DATABASE_URL);
export const db = drizzle(client);
if (!env.USER_DATABASE_URL) throw new Error("DATABASE_URL is not set");
