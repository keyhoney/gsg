import { Lucia, TimeSpan } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import type { Env } from "@env";

export const createLucia = (env: Env) =>
  new Lucia(new D1Adapter(env.DB, {
    user: "users",
    session: "sessions",
  }), {
    sessionExpiresIn: new TimeSpan(30, "d"),
    sessionCookie: {
      name: "kh_session",
      attributes: {
        sameSite: "lax",
        secure: true,
        path: "/",
      },
    },
    getUserAttributes: (attributes) => ({
      email: attributes.email,
    }),
  });

export type LuciaInstance = ReturnType<typeof createLucia>;
