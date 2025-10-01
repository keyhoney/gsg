import type { D1Database } from "@cloudflare/workers-types";

import { run, selectOne } from "@/server/db";

export interface User {
  id: string;
  email: string;
  created_at: number;
}

const generateId = () => crypto.randomUUID();

export const findUserByEmail = (db: D1Database, email: string) =>
  selectOne<User>(db, "SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);

export const createUserIfNotExists = async (db: D1Database, email: string) => {
  const normalized = email.toLowerCase();
  const existing = await findUserByEmail(db, normalized);
  if (existing) return existing;

  const id = generateId();
  await run(db, "INSERT INTO users (id, email) VALUES (?, ?)", [id, normalized]);
  return { id, email: normalized, created_at: Math.floor(Date.now() / 1000) } satisfies User;
};
