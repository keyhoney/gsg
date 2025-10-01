import React from "react";

interface WelcomeHeroProps {
  /** 사용자 이메일 */
  userEmail?: string;
  /** 환영 메시지 표시 여부 */
  showWelcome?: boolean;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  userEmail,
  showWelcome = true,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-3xl border border-border p-8 md:p-12">
      {/* 배경 장식 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
        {showWelcome && (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                GSG
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                실물 교재를 통한 인증으로 안전하고 정확한 수학 해설을 제공합니다
              </p>
            </div>
            
            {userEmail && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border border-border">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">환영합니다, {userEmail}</span>
              </div>
            )}
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">안전한 인증</h3>
                <p className="text-sm text-muted-foreground">
                  실물 교재를 통한 소유권 증명으로 정품 사용자만 접근 가능
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">정확한 해설</h3>
                <p className="text-sm text-muted-foreground">
                  KaTeX를 활용한 수학 공식의 정확하고 아름다운 렌더링
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">보안 보호</h3>
                <p className="text-sm text-muted-foreground">
                  워터마킹과 콘텐츠 보호로 무단 복제 방지
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeHero;
