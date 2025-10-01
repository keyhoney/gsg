import React, { useState, useEffect } from "react";
import { getCacheSize, clearMathCache } from "@/hooks/useMathRenderer";

interface MathPerformanceMonitorProps {
  /** 모니터링 활성화 여부 */
  enabled?: boolean;
  /** 자동 정리 간격 (ms) */
  cleanupInterval?: number;
  /** 최대 캐시 크기 */
  maxCacheSize?: number;
}

export const MathPerformanceMonitor: React.FC<MathPerformanceMonitorProps> = ({
  enabled = false,
  cleanupInterval = 300000, // 5분
  maxCacheSize = 100,
}) => {
  const [cacheSize, setCacheSize] = useState(0);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const updateStats = () => {
      setCacheSize(getCacheSize());
    };

    const interval = setInterval(updateStats, 1000);
    updateStats();

    return () => clearInterval(interval);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const cleanup = () => {
      if (getCacheSize() > maxCacheSize) {
        clearMathCache();
        setCacheSize(0);
      }
    };

    const interval = setInterval(cleanup, cleanupInterval);
    return () => clearInterval(interval);
  }, [enabled, cleanupInterval, maxCacheSize]);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg p-3 shadow-lg text-xs">
      <div className="space-y-1">
        <div className="font-medium">수식 렌더링 성능</div>
        <div>캐시 크기: {cacheSize}</div>
        <div>렌더링 횟수: {renderCount}</div>
        <button
          onClick={() => {
            clearMathCache();
            setCacheSize(0);
          }}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          캐시 정리
        </button>
      </div>
    </div>
  );
};

export default MathPerformanceMonitor;
