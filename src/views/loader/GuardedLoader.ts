import { redirect } from "react-router-dom";

import { getSession } from "@/lib/api/auth";
import { DEV_MODE, SKIP_AUTH_IN_DEV } from "@/lib/constants";

export const GuardedLoader = async () => {
  // 개발 모드에서 인증 스킵
  if (DEV_MODE && SKIP_AUTH_IN_DEV) {
    console.log("🔓 개발 모드: 인증 우회됨");
    return null;
  }

  try {
    const session = await getSession();
    if (!session.authenticated) {
      return redirect("/auth/email");
    }
    return null;
  } catch (error) {
    console.error("Session check failed:", error);
    return redirect("/auth/email");
  }
};
