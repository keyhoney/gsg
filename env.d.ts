import type { D1Database, KVNamespace, Fetcher } from "@cloudflare/workers-types";

export interface Env {
  DB: D1Database;
  OTP_KV: KVNamespace;
  SESSION_KV: KVNamespace;
  TURNSTILE_SECRET: string;
  EMAIL_API_KEY: string;
  ORIGIN: string;
  LUCIA_SESSION_SECRET: string;
  ADMIN_API_KEY: string;
  ASSETS: Fetcher;
}
