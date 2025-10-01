import type { D1Database } from "@cloudflare/workers-types";

export const run = async <T = unknown>(db: D1Database, query: string, params: unknown[] = []) => {
  const stmt = db.prepare(query);
  const bound = params.length ? stmt.bind(...params) : stmt;
  const result = await bound.run();
  return result as T;
};

export const select = async <T = unknown>(db: D1Database, query: string, params: unknown[] = []) => {
  const stmt = db.prepare(query);
  const bound = params.length ? stmt.bind(...params) : stmt;
  const result = await bound.all<T>();
  return result.results ?? [];
};

export const selectOne = async <T = unknown>(db: D1Database, query: string, params: unknown[] = []) => {
  const stmt = db.prepare(query);
  const bound = params.length ? stmt.bind(...params) : stmt;
  const result = await bound.first<T>();
  return result ?? null;
};
