import { Pool } from "pg";
import { env } from "./env.js";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.on("connect", () => {
  console.log("🐘 Connected to the database");
});

pool.on("error", (err) => {
  console.error("❌ Database connection error:", err);
  process.exit(-1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
