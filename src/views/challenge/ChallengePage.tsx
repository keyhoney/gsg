import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { fetchChallengeQuestions, submitChallengeAnswers } from "@/lib/api/challenge";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { DEV_MODE, SKIP_AUTH_IN_DEV } from "@/lib/constants";

interface ChallengeQuestion {
  id: number;
  book_id: string;
  page: number;
  line: number;
  word_index: number;
}

export const ChallengePage = () => {
  const navigate = useNavigate();
  const [bookId] = useState("sample-book-1"); // 실제로는 URL 파라미터나 props에서 받아야 함
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [message, setMessage] = useState("");

  // 개발 모드에서는 자동으로 우회
  useEffect(() => {
    if (DEV_MODE && SKIP_AUTH_IN_DEV) {
      console.log("🔓 개발 모드: 교재 인증 우회됨");
      setMessage("개발 모드: 교재 인증이 자동으로 완료되었습니다.");
      setTimeout(() => navigate("/explanation"), 1500);
    }
  }, [navigate]);

  const { data: questions, isLoading } = useQuery({
    queryKey: ["challenge-questions", bookId],
    queryFn: () => fetchChallengeQuestions(bookId),
    enabled: !!bookId && !(DEV_MODE && SKIP_AUTH_IN_DEV),
  });

  const submitMutation = useMutation({
    mutationFn: (answers: { questionId: number; value: string }[]) =>
      submitChallengeAnswers(bookId, answers),
    onSuccess: () => {
      setMessage("교재 인증이 완료되었습니다! 해설에 접근할 수 있습니다.");
      setTimeout(() => navigate("/"), 2000);
    },
    onError: (error: any) => {
      setMessage(error.message || "인증에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (!questions?.questions) return;
    
    const answerArray = questions.questions.map(q => ({
      questionId: q.id,
      value: answers[q.id] || "",
    }));

    if (answerArray.some(a => !a.value)) {
      setMessage("모든 질문에 답해주세요.");
      return;
    }

    submitMutation.mutate(answerArray);
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
      completed: true,
      current: false,
    },
    {
      id: "challenge",
      title: "교재 인증",
      description: "교재 소유권 증명",
      completed: false,
      current: true,
    },
  ];

  // 개발 모드일 때는 자동 리다이렉션 메시지 표시
  if (DEV_MODE && SKIP_AUTH_IN_DEV) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold">GSG</h1>
              <p className="text-sm text-muted-foreground">
                안전하고 정확한 수학 해설에 접근하세요
              </p>
            </div>
            <div className="mt-6">
              <ProgressIndicator steps={authSteps} compact={true} />
            </div>
          </div>
          
          <div className="rounded-3xl border border-green-200 bg-green-50 p-8 shadow-lg">
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center space-y-4">
                <div className="text-6xl">🔓</div>
                <h3 className="text-lg font-semibold text-green-800">개발 모드 활성화</h3>
                <p className="text-sm text-green-700">{message}</p>
                <p className="text-xs text-green-600">해설 페이지로 이동 중...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold">GSG</h1>
              <p className="text-sm text-muted-foreground">
                안전하고 정확한 수학 해설에 접근하세요
              </p>
            </div>
            <div className="mt-6">
              <ProgressIndicator steps={authSteps} compact={true} />
            </div>
          </div>
          
          <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <h3 className="text-lg font-semibold">교재 인증 준비 중</h3>
                <p className="text-sm text-muted-foreground">질문을 불러오는 중...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!questions?.questions) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
        <h2 className="text-2xl font-semibold">교재 소유권 인증</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          질문을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
        <h2 className="text-2xl font-semibold">교재 소유권 인증</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          실물 교재를 참조하여 아래 질문에 답해주세요. 3개 중 2개 이상 맞으면 인증이 완료됩니다.
        </p>
      </div>

      <div className="space-y-4">
        {questions.questions.map((question: ChallengeQuestion, index: number) => (
          <div key={question.id} className="rounded-3xl border border-border bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">
              질문 {index + 1}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {question.page}페이지, {question.line}번째 줄, {question.word_index}번째 단어는 무엇인가요?
            </p>
            <input
              type="text"
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="답을 입력하세요"
            />
          </div>
        ))}
      </div>

      {message && (
        <div className={`rounded-3xl border p-4 ${
          message.includes("완료") 
            ? "border-green-200 bg-green-50 text-green-800" 
            : "border-red-200 bg-red-50 text-red-800"
        }`}>
          <p className="text-sm">{message}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={submitMutation.isPending}
          className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {submitMutation.isPending ? "인증 중..." : "인증 제출"}
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  );
};
