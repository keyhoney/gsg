import React, { memo } from "react";
import { useMathRenderer } from "@/hooks/useMathRenderer";

interface OptimizedMathRendererProps {
  /** LaTeX 수식 문자열 */
  formula: string;
  /** 인라인 수식인지 블록 수식인지 */
  display?: boolean;
  /** 에러 발생 시 표시할 메시지 */
  errorMessage?: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 로딩 인디케이터 표시 여부 */
  showLoading?: boolean;
  /** 재시도 버튼 표시 여부 */
  showRetry?: boolean;
}

export const OptimizedMathRenderer: React.FC<OptimizedMathRendererProps> = memo(({
  formula,
  display = false,
  errorMessage = "수식 렌더링 오류",
  className = "",
  showLoading = true,
  showRetry = true,
}) => {
  const { html, isLoading, error, retry } = useMathRenderer(formula, display, {
    debounceMs: 150,
    maxRetries: 2,
    enableCache: true,
  });

  if (isLoading && showLoading) {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <div className="animate-pulse bg-muted rounded w-16 h-4 mr-2"></div>
        <span className="text-xs text-muted-foreground">렌더링 중...</span>
      </span>
    );
  }

  if (error) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
          {errorMessage}
        </span>
        {showRetry && (
          <button
            onClick={retry}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            재시도
          </button>
        )}
      </span>
    );
  }

  if (!html) {
    return null;
  }

  return (
    <span
      className={`math-renderer ${display ? "block" : "inline"} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

OptimizedMathRenderer.displayName = "OptimizedMathRenderer";

export default OptimizedMathRenderer;
