import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { ThemeToggle } from "@/components/ThemeToggle";
import { getSession } from "@/lib/api/auth";

export const RootLayout = () => {
  const { data: session } = useQuery({ 
    queryKey: ["session"], 
    queryFn: getSession 
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    KeyHoney Explanation Platform
                  </p>
                  <h1 className="text-xl font-semibold">교재 해설 인증 시스템</h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {session?.authenticated && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">{session.email}</span>
                </div>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
      
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 수학 해설 플랫폼. 모든 권리 보유.
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-foreground transition-colors">이용약관</a>
              <a href="#" className="hover:text-foreground transition-colors">문의하기</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
