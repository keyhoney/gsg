import React, { useState, useRef, useEffect } from "react";
import { OptimizedMathRenderer } from "./OptimizedMathRenderer";

interface LazyMathRendererProps {
  /** LaTeX 수식 문자열 */
  formula: string;
  /** 인라인 수식인지 블록 수식인지 */
  display?: boolean;
  /** 에러 발생 시 표시할 메시지 */
  errorMessage?: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 뷰포트에 들어왔을 때 렌더링할지 여부 */
  lazy?: boolean;
  /** 뷰포트 감지 임계값 */
  threshold?: number;
}

export const LazyMathRenderer: React.FC<LazyMathRendererProps> = ({
  formula,
  display = false,
  errorMessage = "수식 렌더링 오류",
  className = "",
  lazy = true,
  threshold = 0.1,
}) => {
  const [isVisible, setIsVisible] = useState(!lazy);
  const [hasRendered, setHasRendered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lazy || hasRendered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasRendered(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: "50px",
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, hasRendered, threshold]);

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? (
        <OptimizedMathRenderer
          formula={formula}
          display={display}
          errorMessage={errorMessage}
        />
      ) : (
        <div className="animate-pulse bg-muted rounded h-6 w-32"></div>
      )}
    </div>
  );
};

export default LazyMathRenderer;
