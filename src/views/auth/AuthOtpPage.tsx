
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { verifyOtp } from "@/lib/api/auth";
import { ProgressIndicator } from "@/components/ProgressIndicator";

export const AuthOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  // 이전 페이지에서 전달된 이메일 주소 사용
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const mutation = useMutation({
    mutationFn: ({ email, otp, token }: { email: string; otp: string; token: string }) =>
      verifyOtp(email, otp, token),
    onSuccess: () => {
      setMessage("인증이 완료되었습니다!");
      setTimeout(() => navigate("/"), 1500);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) setMessage(error.message);
      else setMessage("OTP 검증에 실패했습니다.");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      setMessage("이메일 주소를 입력해주세요.");
      return;
    }
    mutation.mutate({ email, otp, token });
  };

  const authSteps = [
    {
      id: "email",
      title: "이메일 입력",
      description: "이메일 주소 입력",
      completed: true,
      current: false,
    },
    {
      id: "otp",
      title: "OTP 인증",
      description: "인증 코드 입력",
      completed: false,
      current: true,
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

        {/* OTP 인증 폼 */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
          <header className="space-y-3 text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold">OTP 인증</h2>
            <p className="text-sm text-muted-foreground">
              {email}로 전송된 6자리 인증 코드를 입력하세요.
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
            <label htmlFor="otp" className="block text-sm font-medium">
              OTP 코드
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-center text-lg tracking-[0.8em] focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">봇 방지 확인</label>
            <input
              className="w-full rounded-xl border border-dashed border-muted-foreground px-4 py-3 text-center text-sm text-muted-foreground"
              placeholder="Turnstile 토큰"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-primary py-3 text-base font-medium text-primary-foreground shadow transition hover:bg-primary/90"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "확인 중..." : "OTP 인증"}
          </button>
        </form>

        {message && (
          <div className={`mt-4 rounded-xl p-3 text-center text-sm ${
            message.includes("완료") 
              ? "bg-green-50 text-green-800 border border-green-200" 
              : "bg-destructive/10 text-destructive"
          }`}>
            <p>{message}</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};