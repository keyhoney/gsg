import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import type { Env } from "@env";
import { emailSchema } from "@/lib/validators/auth";
import { sendEmail } from "@/server/services/email-service";
import {
  generateOtp,
  isRateLimited,
  storeOtp,
} from "@/server/services/otp-service";

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
  .post(
    "",
    zValidator("json", emailSchema),
    async (c) => {
      const { email, token } = c.req.valid("json");
      const env = c.env;

      const remoteIP = c.req.header("CF-Connecting-IP");
      const turnstile = await verifyTurnstile(env.TURNSTILE_SECRET, token, remoteIP);
      if (!turnstile) return c.json({ ok: false, message: "Turnstile 검증에 실패했습니다." }, 400);

      const rateLimited = await isRateLimited(env.OTP_KV, email);
      if (rateLimited) {
        return c.json({ ok: false, message: "OTP 요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }, 429);
      }

      const otp = generateOtp();
      await storeOtp(env.OTP_KV, email, otp);

      await sendEmail(env, {
        to: email,
        subject: "KeyHoney 해설 플랫폼 OTP",
        html: `<p>OTP 코드는 <strong>${otp}</strong> 입니다. 5분 내에 입력해주세요.</p>`,
      });

      return c.json({ ok: true, message: "OTP가 발송되었습니다." });
    }
  )
  .fetch;
