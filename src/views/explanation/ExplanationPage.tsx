import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getSession } from "@/lib/api/auth";
import { ExplanationContent } from "@/components/ExplanationContent";
import { WatermarkProvider } from "@/components/WatermarkProvider";
import { ContentProtection } from "@/components/ContentProtection";
import { DynamicWatermark } from "@/components/DynamicWatermark";
import { SecurityDashboard } from "@/components/SecurityDashboard";
import { SecurityMonitor } from "@/components/SecurityMonitor";
import { ContentLayout } from "@/components/ContentLayout";
import { EnhancedMathRenderer } from "@/components/EnhancedMathRenderer";
import { MathText } from "@/components/MathText";
import { DEV_MODE, SKIP_AUTH_IN_DEV } from "@/lib/constants";

export const ExplanationPage = () => {
  const navigate = useNavigate();
  const { data: session, isLoading } = useQuery({ 
    queryKey: ["session"], 
    queryFn: getSession,
    enabled: !(DEV_MODE && SKIP_AUTH_IN_DEV) // 개발 모드에서는 세션 쿼리 비활성화
  });

  // 개발 모드가 아닐 때만 세션 체크
  if (!(DEV_MODE && SKIP_AUTH_IN_DEV)) {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">세션 확인 중...</p>
          </div>
        </div>
      );
    }

    if (!session?.authenticated) {
      return (
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
          <h2 className="text-2xl font-semibold">로그인이 필요합니다</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            이메일 OTP 인증을 완료한 뒤 해설 콘텐츠에 접근할 수 있습니다.
          </p>
          <button 
            onClick={() => navigate("/auth/email")}
            className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            로그인하기
          </button>
        </div>
      );
    }
  }

  // 개발 모드일 때 사용할 테스트 이메일
  const userEmail = (DEV_MODE && SKIP_AUTH_IN_DEV) ? "test@developer.com" : (session?.email || "");

  // 임시 샘플 데이터 (실제로는 API에서 가져올 예정)
  const sampleExplanation = {
    title: "이차방정식의 해법",
    content: `이차방정식 $ax^2 + bx + c = 0$의 해를 구하는 방법을 알아보겠습니다.

먼저 판별식 $D = b^2 - 4ac$를 계산합니다. 판별식의 값에 따라 해의 개수가 결정됩니다:

$$D > 0$$이면 서로 다른 두 실근을 가집니다.
$$D = 0$$이면 중근을 가집니다.
$$D < 0$$이면 서로 다른 두 허근을 가집니다.

해를 구하는 공식은 다음과 같습니다:

$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

이 공식을 사용하여 예제를 풀어보겠습니다.`,
    formulas: [
      {
        formula: "ax^2 + bx + c = 0",
        title: "일반형 이차방정식",
        number: "1"
      },
      {
        formula: "D = b^2 - 4ac",
        title: "판별식",
        number: "2"
      },
      {
        formula: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
        title: "근의 공식",
        number: "3"
      }
    ]
  };

  return (
    <WatermarkProvider userEmail={userEmail} density="medium">
      <ContentProtection enabled={true} detectDevTools={true}>
        <ContentLayout
          title={`수학 해설 - ${sampleExplanation.title}`}
          showSidebar={true}
          showToolbar={true}
        >
          <div className="space-y-8">
            {/* 환영 메시지 */}
            <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">환영합니다, {userEmail}</h2>
                <p className="text-lg text-muted-foreground">
                  인증된 교재에 대한 해설 콘텐츠를 확인하세요.
                </p>
                <div className="mt-6">
                  <button 
                    onClick={() => navigate("/challenge")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    교재 인증하기
                  </button>
                </div>
              </div>
            </div>

            {/* 수학 공식 렌더링 데모 */}
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">{sampleExplanation.title}</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  이차방정식의 해법에 대한 상세한 설명과 공식들을 확인하세요.
                </p>
              </div>
              
              {/* 주요 공식들 */}
              <div className="grid md:grid-cols-3 gap-6">
                {sampleExplanation.formulas.map((formula, index) => (
                  <div key={index} className="rounded-2xl border border-border bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                        <span className="text-xl font-bold text-primary">{formula.number}</span>
                      </div>
                      <h3 className="text-lg font-semibold">{formula.title}</h3>
                      <EnhancedMathRenderer
                        formula={formula.formula}
                        display={true}
                        zoomable={true}
                        copyable={true}
                        number={formula.number}
                        className="text-center"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 해설 내용 */}
              <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
                <div className="prose prose-lg max-w-none">
                  <h3 className="text-2xl font-bold mb-6">상세 해설</h3>
                  <div className="space-y-6 text-foreground leading-relaxed">
                    <MathText>
                      이차방정식 $ax^2 + bx + c = 0$의 해를 구하는 방법을 알아보겠습니다.
                    </MathText>
                    <MathText>
                      먼저 판별식 $D = b^2 - 4ac$를 계산합니다. 판별식의 값에 따라 해의 개수가 결정됩니다:
                    </MathText>
                    <ul className="space-y-2">
                      <li><MathText>{"$$D > 0$$이면 서로 다른 두 실근을 가집니다."}</MathText></li>
                      <li><MathText>{"$$D = 0$$이면 중근을 가집니다."}</MathText></li>
                      <li><MathText>{"$$D < 0$$이면 서로 다른 두 허근을 가집니다."}</MathText></li>
                    </ul>
                    <MathText>
                      해를 구하는 공식은 다음과 같습니다:
                    </MathText>
                    <div className="text-center my-8">
                      <EnhancedMathRenderer
                        formula="x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"
                        display={true}
                        zoomable={true}
                        copyable={true}
                        className="text-2xl"
                      />
                    </div>
                    <MathText>
                      이 공식을 사용하여 예제를 풀어보겠습니다.
                    </MathText>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ContentLayout>

        {/* 보안 시스템 */}
        <DynamicWatermark 
          userEmail={userEmail} 
          updateInterval={30000}
          positionInterval={60000}
        />
        
        <SecurityDashboard
          userEmail={userEmail}
          visible={true}
          isAdmin={false}
        />
        
        <SecurityMonitor
          enabled={true}
          showWarnings={true}
          autoRefresh={true}
          refreshDelay={5000}
        />
      </ContentProtection>
    </WatermarkProvider>
  );
};
