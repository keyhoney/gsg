import { Hono } from "hono";
import { getCookie } from "hono/cookie";

import type { Env } from "@env";
import { createLucia } from "@/server/lucia";

const app = new Hono<{ Bindings: Env }>();

export const onRequest = app.get("", async (c) => {
  const lucia = createLucia(c.env);
  const cookie = getCookie(c, lucia.sessionCookieName);
  if (!cookie) return c.json({ authenticated: false });

  const { session, user } = await lucia.validateSession(cookie);
  if (!session || !user) return c.json({ authenticated: false });

  return c.json({ authenticated: true, email: user.email });
}).fetch;
