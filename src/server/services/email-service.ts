import type { Env } from "@env";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (env: Env, payload: EmailPayload) => {
  // MailChannels API 사용
  const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: payload.to }],
        },
      ],
      from: {
        email: "noreply@gsg.pages.dev",
        name: "KeyHoney 해설 플랫폼",
      },
      subject: payload.subject,
      content: [
        {
          type: "text/html",
          value: payload.html,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to send email: ${res.status} - ${errorText}`);
  }
};
