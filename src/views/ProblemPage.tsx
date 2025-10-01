import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ContentLayout } from "@/components/ContentLayout";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { loadProblemContent, ProblemContent } from "@/lib/content-loader";
import { WatermarkProvider } from "@/components/WatermarkProvider";
import { ContentProtection } from "@/components/ContentProtection";

export const ProblemPage = () => {
  const { bookId, problemId } = useParams<{ bookId: string; problemId: string }>();

  const { data: problem, isLoading, error } = useQuery({
    queryKey: ["problem", bookId, problemId],
    queryFn: async () => {
      if (!bookId || !problemId) {
        throw new Error("책 ID와 문제 ID가 필요합니다.");
      }
      return await loadProblemContent(bookId, problemId);
    },
    enabled: !!bookId && !!problemId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <LoadingSpinner size="lg" message="문항을 불러오는 중..." />
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">문항을 찾을 수 없습니다</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "요청하신 문항이 존재하지 않거나 접근 권한이 없습니다."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <WatermarkProvider userEmail="test@developer.com" density="medium">
      <ContentProtection enabled={true} detectDevTools={true}>
        <ContentLayout title={`문항 ${problem.metadata.problemNumber}`}>
      <div className="space-y-8">
        {/* 문항 내용 */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
          <div className="prose max-w-none">
            <MarkdownRenderer content={problem.question} />
          </div>
        </div>

        {/* 난이도 및 메타 정보 */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">문항 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">페이지:</span>
                  <span className="font-medium">p. {problem.metadata.page}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">난이도:</span>
                  <span className={`font-medium ${
                    problem.metadata.difficulty === '초급' ? 'text-green-600' :
                    problem.metadata.difficulty === '중급' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {problem.metadata.difficulty}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">관련 개념</h3>
              <div className="flex flex-wrap gap-2">
                {problem.metadata.concepts.map((concept, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 해설 내용 */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
          <div className="prose max-w-none">
            <MarkdownRenderer content={problem.solution} />
          </div>
        </div>

        {/* 관련 문항들 */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">관련 문항들</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {problem.metadata.relatedProblems?.map((relatedId, index) => (
              <button 
                key={index}
                className="p-4 bg-secondary/10 hover:bg-secondary/20 rounded-lg text-center transition-colors"
              >
                <div className="text-sm text-muted-foreground">{relatedId}</div>
                <div className="font-medium">관련 문항</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ContentLayout>
      </ContentProtection>
    </WatermarkProvider>
  );
};
