import React, { useEffect, useState } from "react";

interface PerformanceMonitorProps {
  /** 모니터링 활성화 여부 */
  enabled?: boolean;
  /** 개발 모드에서만 표시 */
  devOnly?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = true,
  devOnly = true,
}) => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    fps: 0,
  });

  useEffect(() => {
    if (!enabled) return;

    // 페이지 로드 시간 측정
    const measureLoadTime = () => {
      if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        setMetrics(prev => ({ ...prev, loadTime }));
      }
    };

    // 메모리 사용량 측정
    const measureMemory = () => {
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        const used = memory.usedJSHeapSize / 1024 / 1024; // MB
        setMetrics(prev => ({ ...prev, memoryUsage: Math.round(used * 100) / 100 }));
      }
    };

    // FPS 측정
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setMetrics(prev => ({ ...prev, fps: frameCount }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    // 렌더링 시간 측정
    const measureRenderTime = () => {
      const start = performance.now();
      
      requestAnimationFrame(() => {
        const end = performance.now();
        setMetrics(prev => ({ ...prev, renderTime: Math.round(end - start) }));
      });
    };

    // 초기 측정
    measureLoadTime();
    measureMemory();
    measureFPS();
    measureRenderTime();

    // 주기적 메모리 측정
    const interval = setInterval(measureMemory, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [enabled, devOnly]);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg text-xs font-mono z-50">
      <div className="space-y-1">
        <div className="font-semibold text-foreground mb-2">Performance</div>
        <div className="space-y-1 text-muted-foreground">
          <div>Load: {metrics.loadTime}ms</div>
          <div>Render: {metrics.renderTime}ms</div>
          <div>Memory: {metrics.memoryUsage}MB</div>
          <div>FPS: {metrics.fps}</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
