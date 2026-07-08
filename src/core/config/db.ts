import { Pool } from "pg";
import env from "./env";

const pool = new Pool({
  user: env.DB_USERNAME,
  host: env.DB_HOST,
  password: env.DB_PASSWORD,
  database: env.DATABASE,
  port: env.DB_PORT,
});

export default pool;
