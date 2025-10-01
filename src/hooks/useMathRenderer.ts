import { useState, useEffect, useCallback } from "react";
import katex from "katex";
import { getMathRenderOptions } from "@/lib/math-utils";

interface UseMathRendererOptions {
  /** 렌더링 지연 시간 (ms) */
  debounceMs?: number;
  /** 에러 발생 시 재시도 횟수 */
  maxRetries?: number;
  /** 캐시 사용 여부 */
  enableCache?: boolean;
}

interface MathRenderResult {
  html: string | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

const renderCache = new Map<string, string>();

export const useMathRenderer = (
  formula: string,
  display: boolean = false,
  options: UseMathRendererOptions = {}
): MathRenderResult => {
  const {
    debounceMs = 100,
    maxRetries = 3,
    enableCache = true,
  } = options;

  const [html, setHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const cacheKey = `${formula}-${display}`;

  const renderFormula = useCallback(async () => {
    if (!formula.trim()) {
      setHtml(null);
      setError(null);
      return;
    }

    // 캐시 확인
    if (enableCache && renderCache.has(cacheKey)) {
      setHtml(renderCache.get(cacheKey)!);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = katex.renderToString(formula, getMathRenderOptions(display));
      
      // 캐시에 저장
      if (enableCache) {
        renderCache.set(cacheKey, result);
      }
      
      setHtml(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "수식 렌더링 오류";
      setError(errorMessage);
      console.error("Math rendering error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [formula, display, cacheKey, enableCache]);

  const retry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setError(null);
    }
  }, [retryCount, maxRetries]);

  // 디바운스된 렌더링
  useEffect(() => {
    const timeoutId = setTimeout(renderFormula, debounceMs);
    return () => clearTimeout(timeoutId);
  }, [renderFormula, debounceMs]);

  // 재시도 시 렌더링
  useEffect(() => {
    if (retryCount > 0) {
      renderFormula();
    }
  }, [retryCount, renderFormula]);

  return {
    html,
    isLoading,
    error,
    retry,
  };
};

// 캐시 관리 함수들
export const clearMathCache = () => {
  renderCache.clear();
};

export const getCacheSize = () => {
  return renderCache.size;
};

export const preloadMathFormulas = (formulas: string[], display: boolean = false) => {
  formulas.forEach(formula => {
    const cacheKey = `${formula}-${display}`;
    if (!renderCache.has(cacheKey)) {
      try {
        const result = katex.renderToString(formula, getMathRenderOptions(display));
        renderCache.set(cacheKey, result);
      } catch (error) {
        console.warn(`Failed to preload formula: ${formula}`, error);
      }
    }
  });
};
