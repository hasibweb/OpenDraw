import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

dotenv.config({
  path: "../../apps/server/.env",
});

async function main() {
  const url = process.env.DATABASE_DIRECT_URL || process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set.");

  const pool = new Pool({ connectionString: url });
  const db = drizzle(pool);

  try {
    console.log("db:migrate: applying migrations from ./src/migrations");
    await migrate(db, { migrationsFolder: "./src/migrations" });
    console.log("db:migrate: migrations applied.");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exitCode = 1;
});
