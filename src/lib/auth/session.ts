import { getSession } from "@/lib/api/auth";

export const loadSession = async () => {
  const session = await getSession();
  return session;
};
