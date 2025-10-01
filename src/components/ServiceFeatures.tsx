import React from "react";

interface ServiceFeaturesProps {
  /** 컴팩트 모드 */
  compact?: boolean;
}

export const ServiceFeatures: React.FC<ServiceFeaturesProps> = ({
  compact = false,
}) => {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "이메일 OTP 인증",
      description: "비밀번호 없이 이메일만으로 간편하고 안전한 로그인",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "교재 소유권 증명",
      description: "실물 교재의 특정 페이지와 줄을 통한 소유권 인증",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "수학 공식 렌더링",
      description: "KaTeX를 활용한 정확하고 아름다운 수학 공식 표시",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "콘텐츠 보안",
      description: "워터마킹과 복사 방지로 무단 배포 차단",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="text-center space-y-2">
            <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mx-auto ${feature.color}`}>
              {feature.icon}
            </div>
            <h3 className="text-sm font-medium">{feature.title}</h3>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">서비스 특징</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          안전하고 정확한 수학 해설을 위한 혁신적인 플랫폼
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="group p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceFeatures;
