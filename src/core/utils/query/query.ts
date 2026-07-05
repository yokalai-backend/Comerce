import pool from "../../config/db";

export async function queryOne<T>(
  query: string,
  values?: unknown[],
): Promise<T | undefined> {
  const res = await pool.query(query, values);

  return res.rows[0];
}

export async function executeQuery(query: string, values?: unknown[]) {
  return pool.query(query, values);
}
