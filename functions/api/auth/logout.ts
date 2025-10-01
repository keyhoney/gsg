import { Hono } from "hono";

import type { Env } from "@env";
import { createLucia } from "@/server/lucia";

const app = new Hono<{ Bindings: Env }>();

export const onRequest = app.post("", async (c) => {
  const lucia = createLucia(c.env);
  const cookie = lucia.createBlankSessionCookie();

  return new Response(null, {
    status: 204,
    headers: {
      "Set-Cookie": cookie.serialize(),
    },
  });
}).fetch;
