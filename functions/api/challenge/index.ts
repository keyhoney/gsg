import { Hono } from "hono";
import type { Context } from "hono";
import { z } from "zod";

import type { Env } from "@env";
import { CHALLENGE_PASS_COUNT, CHALLENGE_QUESTIONS_COUNT, ENTITLEMENT_DURATION_DAYS } from "@/lib/constants";
import { createLucia } from "@/server/lucia";
import { run, select } from "@/server/db";
import { getCookie } from "hono/cookie";

const app = new Hono<{ Bindings: Env }>();

interface ChallengeRow {
  id: number;
  answer_word: string;
}

const attemptSchema = z.object({
  book_id: z.string().min(1),
  answers: z
    .array(
      z.object({
        questionId: z.number().int().positive(),
        value: z.string().min(1),
      })
    )
    .length(CHALLENGE_QUESTIONS_COUNT),
});

const requireSession = async (c: Context<{ Bindings: Env }>) => {
  const lucia = createLucia(c.env);
  const cookie = getCookie(c, lucia.sessionCookieName);
  if (!cookie) return null;
  const { user } = await lucia.validateSession(cookie);
  if (!user) return null;
  return user;
};

app.get("", async (c) => {
  const user = await requireSession(c);
  if (!user) return c.json({ ok: false, message: "인증이 필요합니다." }, 401);

  const bookId = c.req.query("book_id");
  if (!bookId) return c.json({ ok: false, message: "book_id가 필요합니다." }, 400);

  const questions = await select(
    c.env.DB,
    `SELECT * FROM challenge_index WHERE book_id = ? ORDER BY random() LIMIT ?`,
    [bookId, CHALLENGE_QUESTIONS_COUNT]
  );

  if (questions.length < CHALLENGE_QUESTIONS_COUNT) {
    return c.json({ ok: false, message: "챌린지 데이터가 부족합니다." }, 400);
  }

  return c.json({ ok: true, questions });
});

app.post("", async (c) => {
  const user = await requireSession(c);
  if (!user) return c.json({ ok: false, message: "인증이 필요합니다." }, 401);

  const body = await c.req.json();
  const parsed = attemptSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ ok: false, message: parsed.error.issues[0]?.message ?? "요청이 유효하지 않습니다." }, 400);
  }

  const { book_id, answers } = parsed.data;

  const rows = await select<ChallengeRow>(
    c.env.DB,
    `SELECT id, answer_word FROM challenge_index WHERE id IN (${answers.map(() => "?").join(", ")})`,
    answers.map((answer) => answer.questionId)
  );

  let correctCount = 0;
  for (const answer of answers) {
    const row = rows.find((item) => item.id === answer.questionId);
    if (!row) continue;
    if (row.answer_word.trim().toLowerCase() === answer.value.trim().toLowerCase()) {
      correctCount += 1;
    }
  }

  if (correctCount < CHALLENGE_PASS_COUNT) {
    return c.json({ ok: false, message: "정답이 부족합니다. 다시 시도하세요." }, 403);
  }

  const expiresAt = Math.floor(Date.now() / 1000) + ENTITLEMENT_DURATION_DAYS * 24 * 60 * 60;
  await run(
    c.env.DB,
    `INSERT INTO entitlements (user_id, book_id, expires_at)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id, book_id)
     DO UPDATE SET expires_at = excluded.expires_at`,
    [user.id, book_id, expiresAt]
  );

  return c.json({ ok: true, message: "해당 교재 해설 접근 권한이 부여되었습니다." });
});

export const onRequest = app.fetch;
