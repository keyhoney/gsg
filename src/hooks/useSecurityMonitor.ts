import { useState, useEffect, useCallback } from "react";
import { detectDevTools } from "@/lib/content-protection";

interface SecurityEvent {
  type: "devtools" | "copy" | "print" | "screenshot" | "keyboard" | "suspicious";
  timestamp: number;
  details: Record<string, any>;
  severity: "low" | "medium" | "high" | "critical";
}

interface UseSecurityMonitorOptions {
  /** 모니터링 활성화 여부 */
  enabled?: boolean;
  /** 사용자 이메일 */
  userEmail?: string;
  /** 세션 ID */
  sessionId?: string;
  /** 이벤트 전송 간격 (ms) */
  reportInterval?: number;
  /** 자동 로그아웃 여부 */
  autoLogout?: boolean;
  /** 위험 임계값 */
  riskThreshold?: number;
}

export const useSecurityMonitor = (options: UseSecurityMonitorOptions = {}) => {
  const {
    enabled = true,
    userEmail,
    sessionId,
    reportInterval = 30000, // 30초
    autoLogout = true,
    riskThreshold = 5,
  } = options;

  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [riskScore, setRiskScore] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  // 이벤트 추가
  const addEvent = useCallback((event: Omit<SecurityEvent, "timestamp">) => {
    const newEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now(),
    };

    setEvents(prev => [...prev.slice(-9), newEvent]); // 최대 10개 이벤트 유지

    // 위험 점수 계산
    const severityPoints = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 5,
    };

    setRiskScore(prev => {
      const newScore = prev + severityPoints[event.severity];
      return Math.max(0, newScore - 1); // 시간이 지나면 점수 감소
    });
  }, []);

  // 이벤트 전송
  const reportEvent = useCallback(async (event: SecurityEvent) => {
    if (!userEmail) return;

    try {
      await fetch("/api/security/monitor/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...event,
          userEmail,
          sessionId,
          ip: "client", // 실제로는 서버에서 IP 추출
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.error("Failed to report security event:", error);
    }
  }, [userEmail, sessionId]);

  // 개발자 도구 감지
  useEffect(() => {
    if (!enabled) return;

    const cleanup = detectDevTools((isOpen) => {
      if (isOpen && !devToolsOpen) {
        setDevToolsOpen(true);
        addEvent({
          type: "devtools",
          details: { action: "opened" },
          severity: "high",
        });
      } else if (!isOpen && devToolsOpen) {
        setDevToolsOpen(false);
        addEvent({
          type: "devtools",
          details: { action: "closed" },
          severity: "low",
        });
      }
    });

    return cleanup;
  }, [enabled, devToolsOpen, addEvent]);

  // 키보드 이벤트 모니터링
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 위험한 단축키 감지
      const dangerousKeys = ["F12", "F11", "F10"];
      const dangerousCombinations = [
        { ctrl: true, shift: true, key: "I" },
        { ctrl: true, shift: true, key: "J" },
        { ctrl: true, shift: true, key: "C" },
        { ctrl: true, key: "U" },
        { ctrl: true, key: "S" },
        { ctrl: true, key: "P" },
      ];

      const isDangerousKey = dangerousKeys.includes(e.key);
      const isDangerousCombo = dangerousCombinations.some(combo => 
        combo.ctrl === e.ctrlKey &&
        combo.shift === e.shiftKey &&
        combo.key === e.key
      );

      if (isDangerousKey || isDangerousCombo) {
        addEvent({
          type: "keyboard",
          details: {
            key: e.key,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey,
            metaKey: e.metaKey,
          },
          severity: "medium",
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled, addEvent]);

  // 복사/붙여넣기 이벤트 모니터링
  useEffect(() => {
    if (!enabled) return;

    const handleCopy = (e: ClipboardEvent) => {
      addEvent({
        type: "copy",
        details: {
          action: "copy",
          data: e.clipboardData?.getData("text").substring(0, 100),
        },
        severity: "high",
      });
    };

    const handlePaste = (e: ClipboardEvent) => {
      addEvent({
        type: "copy",
        details: {
          action: "paste",
          data: e.clipboardData?.getData("text").substring(0, 100),
        },
        severity: "medium",
      });
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    
    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
  }, [enabled, addEvent]);

  // 인쇄 이벤트 모니터링
  useEffect(() => {
    if (!enabled) return;

    const handleBeforePrint = () => {
      addEvent({
        type: "print",
        details: { action: "print_attempt" },
        severity: "high",
      });
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    return () => window.removeEventListener("beforeprint", handleBeforePrint);
  }, [enabled, addEvent]);

  // 이벤트 전송
  useEffect(() => {
    if (!enabled || events.length === 0) return;

    const interval = setInterval(() => {
      events.forEach(event => {
        reportEvent(event);
      });
    }, reportInterval);

    return () => clearInterval(interval);
  }, [enabled, events, reportInterval, reportEvent]);

  // 위험 점수 모니터링
  useEffect(() => {
    if (riskScore >= riskThreshold && autoLogout) {
      addEvent({
        type: "suspicious",
        details: { action: "auto_logout", riskScore },
        severity: "critical",
      });
      
      // 자동 로그아웃
      setTimeout(() => {
        window.location.href = "/auth/email";
      }, 2000);
    }
  }, [riskScore, riskThreshold, autoLogout, addEvent]);

  // 모니터링 시작
  useEffect(() => {
    if (enabled) {
      setIsMonitoring(true);
    } else {
      setIsMonitoring(false);
    }
  }, [enabled]);

  return {
    events,
    riskScore,
    isMonitoring,
    devToolsOpen,
    addEvent,
    reportEvent,
  };
};
