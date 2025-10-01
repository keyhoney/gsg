import { Hono } from "hono";
import { getCookie } from "hono/cookie";

import type { Env } from "@env";
import { createLucia } from "@/server/lucia";

const app = new Hono<{ Bindings: Env }>();

export const onRequest = app.get("", async (c) => {
  try {
    // 환경 변수 체크
    if (!c.env.DB || !c.env.SESSION_KV) {
      console.error("Missing bindings: DB or SESSION_KV not configured");
      return c.json({ authenticated: false, error: "Configuration error" }, 500);
    }

    const lucia = createLucia(c.env);
    const cookie = getCookie(c, lucia.sessionCookieName);
    if (!cookie) return c.json({ authenticated: false });

    const { session, user } = await lucia.validateSession(cookie);
    if (!session || !user) return c.json({ authenticated: false });

    return c.json({ authenticated: true, email: user.email });
  } catch (error) {
    console.error("Session validation error:", error);
    return c.json({ authenticated: false, error: "Internal error" }, 500);
  }
}).fetch;
