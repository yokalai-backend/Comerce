import env from "./env";
import { Pool } from "pg";

const pool = new Pool({
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  database: env.DATABASE,
  port: env.DB_PORT,
});

export default pool;
