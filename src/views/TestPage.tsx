import React, { useState } from "react";
import { WelcomeHero } from "@/components/WelcomeHero";
import { ServiceFeatures } from "@/components/ServiceFeatures";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { ReadingModeToggle } from "@/components/ReadingModeToggle";
import { FontSizeControl } from "@/components/FontSizeControl";
import { ThemeToggle } from "@/components/ThemeToggle";
import { EnhancedMathRenderer } from "@/components/EnhancedMathRenderer";
import { MathText } from "@/components/MathText";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const TestPage: React.FC = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const testSteps = [
    {
      id: "step1",
      title: "이메일 입력",
      description: "이메일 주소 입력",
      completed: true,
      current: false,
    },
    {
      id: "step2",
      title: "OTP 인증",
      description: "인증 코드 입력",
      completed: true,
      current: false,
    },
    {
      id: "step3",
      title: "교재 인증",
      description: "교재 소유권 증명",
      completed: false,
      current: true,
    },
  ];

  const handleTestLoading = () => {
    setShowLoading(true);
    setTimeout(() => setShowLoading(false), 3000);
  };

  const handleTestError = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 2000);
  };

  if (showError) {
    throw new Error("테스트 에러입니다!");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* 헤더 */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            🧪 테스트 페이지
          </h1>
          <p className="text-lg text-muted-foreground">
            모든 컴포넌트와 기능을 테스트할 수 있습니다
          </p>
        </div>

        {/* WelcomeHero 테스트 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">WelcomeHero 컴포넌트</h2>
          <WelcomeHero userEmail="test@example.com" showWelcome={true} />
        </div>

        {/* ServiceFeatures 테스트 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">ServiceFeatures 컴포넌트</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">일반 모드</h3>
              <ServiceFeatures compact={false} />
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">컴팩트 모드</h3>
              <ServiceFeatures compact={true} />
            </div>
          </div>
        </div>

        {/* ProgressIndicator 테스트 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">ProgressIndicator 컴포넌트</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">일반 모드</h3>
              <ProgressIndicator steps={testSteps} compact={false} />
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">컴팩트 모드</h3>
              <ProgressIndicator steps={testSteps} compact={true} />
            </div>
          </div>
        </div>

        {/* 컨트롤 컴포넌트들 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">컨트롤 컴포넌트들</h2>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">읽기 모드</h3>
                <ReadingModeToggle />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">폰트 크기</h3>
                <FontSizeControl />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">테마</h3>
                <ThemeToggle />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">테스트 버튼</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleTestLoading}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    로딩 테스트
                  </button>
                  <button
                    onClick={handleTestError}
                    className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                  >
                    에러 테스트
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 수학 공식 렌더링 테스트 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">수학 공식 렌더링</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">MathText 컴포넌트</h3>
              <div className="space-y-4">
                <MathText>인라인 수식: $x^2 + y^2 = z^2$</MathText>
                <MathText>블록 수식:</MathText>
                <MathText>$$E = mc^2$$</MathText>
                <MathText>{"복잡한 수식: $$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$"}</MathText>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">EnhancedMathRenderer</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">확대/복사 가능한 수식:</p>
                  <EnhancedMathRenderer
                    formula="x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"
                    display={true}
                    zoomable={true}
                    copyable={true}
                    number="1"
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">인라인 수식:</p>
                  <EnhancedMathRenderer
                    formula="\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}"
                    display={false}
                    zoomable={true}
                    copyable={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 로딩 스피너 테스트 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">로딩 스피너</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-lg text-center">
              <h3 className="text-lg font-semibold mb-4">작은 크기</h3>
              <LoadingSpinner size="sm" message="로딩 중..." />
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-lg text-center">
              <h3 className="text-lg font-semibold mb-4">중간 크기</h3>
              <LoadingSpinner size="md" message="처리 중..." />
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-lg text-center">
              <h3 className="text-lg font-semibold mb-4">큰 크기</h3>
              <LoadingSpinner size="lg" message="완료 중..." />
            </div>
          </div>
        </div>

        {/* 반응형 테스트 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">반응형 디자인 테스트</h2>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="p-4 bg-primary/10 rounded-lg text-center">
                  <div className="w-8 h-8 bg-primary rounded-lg mx-auto mb-2"></div>
                  <p className="text-sm font-medium">아이템 {i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 다크 모드 테스트 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">다크 모드 테스트</h2>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
            <p className="text-muted-foreground mb-4">
              우측 상단의 테마 토글 버튼을 클릭하여 다크/라이트 모드를 전환해보세요.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="font-semibold text-primary">Primary 색상</h3>
                  <p className="text-sm text-muted-foreground">주요 액션에 사용되는 색상</p>
                </div>
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <h3 className="font-semibold text-secondary">Secondary 색상</h3>
                  <p className="text-sm text-muted-foreground">보조 액션에 사용되는 색상</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold">Muted 배경</h3>
                  <p className="text-sm text-muted-foreground">차분한 배경에 사용되는 색상</p>
                </div>
                <div className="p-4 bg-accent/10 rounded-lg">
                  <h3 className="font-semibold text-accent">Accent 색상</h3>
                  <p className="text-sm text-muted-foreground">강조에 사용되는 색상</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 성능 정보 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">성능 정보</h2>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">구현된 기능</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✅ 이메일 OTP 인증</li>
                  <li>✅ 교재 소유권 증명</li>
                  <li>✅ KaTeX 수식 렌더링</li>
                  <li>✅ 워터마킹 보안</li>
                  <li>✅ 콘텐츠 보호</li>
                  <li>✅ 반응형 디자인</li>
                  <li>✅ 다크 모드</li>
                  <li>✅ 성능 최적화</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">기술 스택</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>⚛️ React + TypeScript</li>
                  <li>🎨 Tailwind CSS</li>
                  <li>🔧 Vite</li>
                  <li>☁️ Cloudflare Pages</li>
                  <li>🔐 Lucia Auth</li>
                  <li>📊 KaTeX</li>
                  <li>🛡️ 보안 시스템</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 로딩 오버레이 */}
      {showLoading && (
        <LoadingSpinner 
          fullScreen={true} 
          size="lg" 
          message="테스트 로딩 중..." 
        />
      )}
    </div>
  );
};

export default TestPage;
