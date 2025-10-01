import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { requestOtp } from "@/lib/api/auth";
import { ProgressIndicator } from "@/components/ProgressIndicator";

export const AuthEmailPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [message, setMessage] = useState("");

  const mutation = useMutation({
    mutationFn: ({ email, token }: { email: string; token: string }) =>
      requestOtp(email, token),
    onSuccess: () => {
      setMessage("OTP가 이메일로 전송되었습니다. 5분 내에 입력해주세요.");
      // OTP 입력 페이지로 리디렉션
      navigate("/auth/otp", { state: { email } });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) setMessage(error.message);
      else setMessage("OTP 요청에 실패했습니다.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ email, token: turnstileToken });
  };

  const authSteps = [
    {
      id: "email",
      title: "이메일 입력",
      description: "이메일 주소 입력",
      completed: false,
      current: true,
    },
    {
      id: "otp",
      title: "OTP 인증",
      description: "인증 코드 입력",
      completed: false,
      current: false,
    },
    {
      id: "challenge",
      title: "교재 인증",
      description: "교재 소유권 증명",
      completed: false,
      current: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* 진행 상황 표시 */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">수학 해설 플랫폼</h1>
            <p className="text-sm text-muted-foreground">
              안전하고 정확한 수학 해설에 접근하세요
            </p>
          </div>
          <div className="mt-6">
            <ProgressIndicator steps={authSteps} compact={true} />
          </div>
        </div>

        {/* 이메일 인증 폼 */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
          <header className="space-y-3 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold">이메일 인증</h2>
            <p className="text-sm text-muted-foreground">
              교재 해설 접근을 위해 이메일 주소로 OTP를 받아 인증하세요.
            </p>
          </header>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              이메일 주소
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">봇 방지 확인</label>
            <input
              className="w-full rounded-xl border border-dashed border-muted-foreground px-4 py-3 text-center text-sm text-muted-foreground"
              placeholder="Turnstile 토큰"
              value={turnstileToken}
              onChange={(e) => setTurnstileToken(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-primary py-3 text-base font-medium text-primary-foreground shadow transition hover:bg-primary/90"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "전송 중..." : "OTP 요청"}
          </button>
        </form>

          {message && (
            <div className={`mt-4 rounded-xl p-3 text-center text-sm ${
              message.includes("전송되었습니다") 
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200" 
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200"
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
