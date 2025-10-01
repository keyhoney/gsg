import type { LuciaInstance } from "./index";

declare module "lucia" {
  interface Register {
    Lucia: LuciaInstance;
    DatabaseUserAttributes: {
      email: string;
    };
    DatabaseSessionAttributes: Record<string, never>;
  }
}
