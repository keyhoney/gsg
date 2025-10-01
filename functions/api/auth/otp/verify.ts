import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import type { Env } from "@env";
import { otpVerifySchema } from "@/lib/validators/auth";
import { createLucia } from "@/server/lucia";
import { clearOtp, validateOtp } from "@/server/services/otp-service";
import { createUserIfNotExists } from "@/server/services/user-service";

const app = new Hono<{ Bindings: Env }>();

const verifyTurnstile = async (secret: string, token: string, remoteip?: string | null) => {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret,
      response: token,
      remoteip: remoteip ?? "",
    }),
  });

  const json = (await res.json()) as { success: boolean };
  return json.success;
};

export const onRequest = app
  .post("", zValidator("json", otpVerifySchema), async (c) => {
    const { email, otp, token } = c.req.valid("json");
    const env = c.env;

    const remoteIP = c.req.header("CF-Connecting-IP");
    const turnstile = await verifyTurnstile(env.TURNSTILE_SECRET, token, remoteIP);
    if (!turnstile) return c.json({ ok: false, message: "Turnstile 검증 실패" }, 400);

    const valid = await validateOtp(env.OTP_KV, email, otp);
    if (!valid)
      return c.json({ ok: false, message: "OTP가 만료되었거나 틀렸습니다." }, 400);

    await clearOtp(env.OTP_KV, email);

    const user = await createUserIfNotExists(env.DB, email);
    const lucia = createLucia(env);
    const session = await lucia.createSession(user.id, {});
    const cookie = lucia.createSessionCookie(session.id);

    const response = c.json({ ok: true, redirect: "/" });
    response.headers.set("Set-Cookie", cookie.serialize());
    return response;
  }).fetch;
