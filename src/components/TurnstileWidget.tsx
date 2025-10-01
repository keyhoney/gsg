import { useEffect, useRef } from "react";

interface TurnstileWidgetProps {
  siteKey: string;
  onSuccess: (token: string) => void;
  onError?: () => void;
}

// Cloudflare Turnstile 타입 정의
declare global {
  interface Window {
    turnstile?: {
      render: (element: string | HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        "error-callback"?: () => void;
        theme?: "light" | "dark" | "auto";
        size?: "normal" | "compact";
      }) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

export const TurnstileWidget = ({ siteKey, onSuccess, onError }: TurnstileWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Turnstile 스크립트가 로드될 때까지 기다림
    const checkTurnstile = setInterval(() => {
      if (window.turnstile && containerRef.current) {
        clearInterval(checkTurnstile);
        
        // 이미 렌더링된 위젯이 있으면 제거
        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
        }

        // Turnstile 위젯 렌더링
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            onSuccess(token);
          },
          "error-callback": () => {
            onError?.();
          },
          theme: "auto",
          size: "normal",
        });
      }
    }, 100);

    // 컴포넌트 언마운트 시 정리
    return () => {
      clearInterval(checkTurnstile);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [siteKey, onSuccess, onError]);

  return (
    <div className="flex justify-center">
      <div ref={containerRef} />
    </div>
  );
};

