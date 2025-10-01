import React from "react";
import { useNavigate } from "react-router-dom";
import { WelcomeHero } from "@/components/WelcomeHero";
import { ServiceFeatures } from "@/components/ServiceFeatures";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth/email");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-16">
        {/* 메인 히어로 섹션 */}
        <WelcomeHero showWelcome={true} />
        
        {/* 서비스 특징 */}
        <div className="rounded-3xl border border-border bg-card p-8 md:p-12 shadow-lg">
          <ServiceFeatures compact={false} />
        </div>
        
        {/* 사용 방법 안내 */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">사용 방법</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              간단한 3단계로 수학 해설에 접근하세요
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold">이메일 인증</h3>
              <p className="text-muted-foreground">
                이메일 주소를 입력하고 OTP 코드를 받아 인증을 완료하세요
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-secondary">2</span>
              </div>
              <h3 className="text-xl font-semibold">교재 인증</h3>
              <p className="text-muted-foreground">
                실물 교재의 특정 페이지와 줄을 확인하여 소유권을 증명하세요
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="text-xl font-semibold">해설 확인</h3>
              <p className="text-muted-foreground">
                인증된 교재의 정확하고 아름다운 수학 해설을 확인하세요
              </p>
            </div>
          </div>
        </div>
        
        {/* 보안 및 개인정보 보호 */}
        <div className="rounded-3xl border border-border bg-card p-8 md:p-12 shadow-lg">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">보안 및 개인정보 보호</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              사용자의 개인정보와 콘텐츠를 보호하기 위한 최고 수준의 보안 시스템
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">데이터 암호화</h3>
                    <p className="text-sm text-muted-foreground">모든 데이터는 최고 수준의 암호화로 보호됩니다</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">워터마킹</h3>
                    <p className="text-sm text-muted-foreground">콘텐츠에 사용자 식별 워터마크를 삽입하여 무단 복제를 방지합니다</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">빠른 인증</h3>
                    <p className="text-sm text-muted-foreground">이메일 OTP로 빠르고 안전한 인증을 제공합니다</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">개인정보 최소화</h3>
                    <p className="text-sm text-muted-foreground">필요한 최소한의 정보만 수집하여 개인정보를 보호합니다</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 시작하기 버튼 */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">지금 시작하세요</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            간단한 인증 과정을 통해 정확하고 안전한 수학 해설에 접근하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              시작하기
            </button>
            <button
              onClick={() => navigate("/test")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-2xl hover:bg-secondary/90 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              테스트 페이지
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
