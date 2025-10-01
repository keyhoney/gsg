import type { Env } from "@env";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (env: Env, payload: EmailPayload) => {
  const endpoint = `${env.ORIGIN}/api/email/send`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.EMAIL_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to send email: ${res.status}`);
  }
};
