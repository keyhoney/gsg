import type { Context } from "hono";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import type { Env } from "@env";
import { run } from "@/server/db";

const app = new Hono<{ Bindings: Env }>();

const challengeSchema = z.object({
  book_id: z.string().min(1),
  page: z.number().int().min(1),
  line: z.number().int().min(1),
  word_index: z.number().int().min(1),
  answer_word: z.string().min(1),
});

const payloadSchema = z.object({
  challenges: z.array(challengeSchema).min(1),
});

const requireAdmin = (c: Context<{ Bindings: Env }>) => {
  const header = c.req.header("x-admin-key");
  if (!header || header !== c.env.ADMIN_API_KEY) {
    return c.json({ ok: false, message: "관리자 키가 유효하지 않습니다." }, 403);
  }
  return null;
};

export const onRequest = app
  .post(
    "",
    zValidator("json", payloadSchema),
    async (c) => {
      const authError = requireAdmin(c);
      if (authError) return authError;

      const { challenges } = c.req.valid("json");

      const db = c.env.DB;
      const query = `INSERT INTO challenge_index (book_id, page, line, word_index, answer_word)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(book_id, page, line, word_index)
        DO UPDATE SET answer_word = excluded.answer_word`;

      for (const item of challenges) {
        await run(db, query, [
          item.book_id,
          item.page,
          item.line,
          item.word_index,
          item.answer_word,
        ]);
      }

      return c.json({ ok: true, message: "챌린지 데이터가 저장되었습니다." });
    }
  )
  .fetch;
