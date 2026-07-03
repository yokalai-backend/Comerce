import bcrypt from "bcrypt";

export async function hashPassword(value: string) {
  return bcrypt.hash(value, 10);
}

export async function verifyPassword(value: string, comparator: string) {
  return bcrypt.compare(value, comparator);
}
