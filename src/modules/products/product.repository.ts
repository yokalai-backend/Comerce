import pool from "../../core/config/pool";

interface ProductsDTO {
  id: string;
}
export async function getProductsRepo() {
  return pool.query(
    `SELECT * FROM products WHERE is_sold = false AND stock > 0`,
  );
}
