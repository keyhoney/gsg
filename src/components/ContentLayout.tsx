import React, { useState } from "react";
import { ReadingModeToggle } from "./ReadingModeToggle";
import { FontSizeControl } from "./FontSizeControl";
import { ThemeToggle } from "./ThemeToggle";

interface ContentLayoutProps {
  /** 콘텐츠 제목 */
  title: string;
  /** 콘텐츠 내용 */
  children: React.ReactNode;
  /** 사이드바 표시 여부 */
  showSidebar?: boolean;
  /** 툴바 표시 여부 */
  showToolbar?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

export const ContentLayout: React.FC<ContentLayoutProps> = ({
  title,
  children,
  showSidebar = true,
  showToolbar = true,
  className = "",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`content-layout ${className}`}>
      {/* 툴바 */}
      {showToolbar && (
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-lg font-semibold truncate">{title}</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <ReadingModeToggle />
                <FontSizeControl />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* 사이드바 */}
        {showSidebar && (
          <div className={`sidebar ${sidebarOpen ? "open" : ""} hidden lg:block`}>
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    목차
                  </h3>
                  <nav className="space-y-2">
                    <a href="#introduction" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                      소개
                    </a>
                    <a href="#formulas" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                      주요 공식
                    </a>
                    <a href="#examples" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                      예제
                    </a>
                    <a href="#exercises" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                      연습 문제
                    </a>
                  </nav>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    설정
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">읽기 모드</span>
                      <ReadingModeToggle />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">폰트 크기</span>
                      <FontSizeControl />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">테마</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 메인 콘텐츠 */}
        <main className="flex-1 min-w-0">
          <div className="container mx-auto px-4 py-8">
            <article className="prose prose-gray dark:prose-invert max-w-none">
              {children}
            </article>
          </div>
        </main>
      </div>

      {/* 모바일 사이드바 오버레이 */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-background border-l border-border">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">설정</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">읽기 모드</span>
                  <ReadingModeToggle />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">폰트 크기</span>
                  <FontSizeControl />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">테마</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentLayout;
