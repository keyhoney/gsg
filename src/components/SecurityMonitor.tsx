import React, { useEffect, useState, useCallback } from "react";
import { detectDevTools } from "@/lib/content-protection";

interface SecurityMonitorProps {
  /** 모니터링 활성화 여부 */
  enabled?: boolean;
  /** 경고 표시 여부 */
  showWarnings?: boolean;
  /** 자동 새로고침 여부 */
  autoRefresh?: boolean;
  /** 새로고침 지연 시간 (ms) */
  refreshDelay?: number;
}

interface SecurityEvent {
  type: "devtools" | "copy" | "print" | "screenshot" | "keyboard";
  timestamp: number;
  message: string;
  severity: "low" | "medium" | "high";
}

export const SecurityMonitor: React.FC<SecurityMonitorProps> = ({
  enabled = true,
  showWarnings = true,
  autoRefresh = true,
  refreshDelay = 5000,
}) => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  const addEvent = useCallback((event: SecurityEvent) => {
    setEvents(prev => [...prev.slice(-9), event]); // 최대 10개 이벤트 유지
  }, []);

  useEffect(() => {
    if (!enabled) return;

    setIsMonitoring(true);

    // 개발자 도구 감지
    const cleanup = detectDevTools((isOpen) => {
      if (isOpen && !devToolsOpen) {
        setDevToolsOpen(true);
        addEvent({
          type: "devtools",
          timestamp: Date.now(),
          message: "개발자 도구가 열렸습니다",
          severity: "high",
        });

        if (autoRefresh) {
          setTimeout(() => {
            window.location.reload();
          }, refreshDelay);
        }
      } else if (!isOpen && devToolsOpen) {
        setDevToolsOpen(false);
        addEvent({
          type: "devtools",
          timestamp: Date.now(),
          message: "개발자 도구가 닫혔습니다",
          severity: "low",
        });
      }
    });

    // 키보드 이벤트 모니터링
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        addEvent({
          type: "keyboard",
          timestamp: Date.now(),
          message: `단축키 사용: ${e.key}`,
          severity: "medium",
        });
      }
    };

    // 복사 이벤트 모니터링
    const handleCopy = (e: ClipboardEvent) => {
      addEvent({
        type: "copy",
        timestamp: Date.now(),
        message: "콘텐츠 복사 시도",
        severity: "high",
      });
    };

    // 인쇄 이벤트 모니터링
    const handleBeforePrint = () => {
      addEvent({
        type: "print",
        timestamp: Date.now(),
        message: "인쇄 시도",
        severity: "high",
      });
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("copy", handleCopy);
    window.addEventListener("beforeprint", handleBeforePrint);

    return () => {
      cleanup();
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", handleCopy);
      window.removeEventListener("beforeprint", handleBeforePrint);
    };
  }, [enabled, devToolsOpen, addEvent, autoRefresh, refreshDelay]);

  if (!enabled || !isMonitoring) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg text-xs max-w-xs">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">보안 모니터</span>
          <div className={`w-2 h-2 rounded-full ${devToolsOpen ? "bg-red-500" : "bg-green-500"}`}></div>
        </div>
        
        <div className="text-muted-foreground">
          <div>상태: {devToolsOpen ? "⚠️ 위험" : "✅ 안전"}</div>
          <div>이벤트: {events.length}개</div>
        </div>

        {showWarnings && events.length > 0 && (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {events.slice(-3).map((event, index) => (
              <div
                key={index}
                className={`p-2 rounded text-xs ${
                  event.severity === "high" 
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : event.severity === "medium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                }`}
              >
                <div className="font-medium">{event.message}</div>
                <div className="text-xs opacity-75">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityMonitor;
