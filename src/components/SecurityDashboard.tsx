import React, { useState, useEffect } from "react";
import { useSecurityMonitor } from "@/hooks/useSecurityMonitor";

interface SecurityDashboardProps {
  /** 사용자 이메일 */
  userEmail: string;
  /** 세션 ID */
  sessionId?: string;
  /** 대시보드 표시 여부 */
  visible?: boolean;
  /** 관리자 모드 */
  isAdmin?: boolean;
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  userEmail,
  sessionId,
  visible = false,
  isAdmin = false,
}) => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    criticalEvents: 0,
    highEvents: 0,
    mediumEvents: 0,
    lowEvents: 0,
    lastEventTime: null as number | null,
    riskScore: 0,
  });

  const { events, riskScore, isMonitoring, devToolsOpen } = useSecurityMonitor({
    enabled: true,
    userEmail,
    sessionId,
    autoLogout: true,
    riskThreshold: 5,
  });

  useEffect(() => {
    // 통계 업데이트
    setStats(prev => ({
      ...prev,
      totalEvents: events.length,
      criticalEvents: events.filter(e => e.severity === "critical").length,
      highEvents: events.filter(e => e.severity === "high").length,
      mediumEvents: events.filter(e => e.severity === "medium").length,
      lowEvents: events.filter(e => e.severity === "low").length,
      lastEventTime: events.length > 0 ? events[events.length - 1].timestamp : null,
      riskScore,
    }));
  }, [events, riskScore]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg z-[10000] max-w-sm">
      <div className="space-y-3">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">보안 대시보드</h3>
          <div className={`w-2 h-2 rounded-full ${
            riskScore >= 5 ? "bg-red-500" : 
            riskScore >= 3 ? "bg-yellow-500" : 
            "bg-green-500"
          }`}></div>
        </div>

        {/* 상태 정보 */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">모니터링:</span>
            <span className={isMonitoring ? "text-green-600" : "text-red-600"}>
              {isMonitoring ? "활성" : "비활성"}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">개발자 도구:</span>
            <span className={devToolsOpen ? "text-red-600" : "text-green-600"}>
              {devToolsOpen ? "감지됨" : "안전"}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">위험 점수:</span>
            <span className={
              riskScore >= 5 ? "text-red-600" : 
              riskScore >= 3 ? "text-yellow-600" : 
              "text-green-600"
            }>
              {riskScore}/10
            </span>
          </div>
        </div>

        {/* 이벤트 통계 */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground">이벤트 통계</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>총 이벤트:</span>
              <span>{stats.totalEvents}</span>
            </div>
            <div className="flex justify-between">
              <span>위험:</span>
              <span className="text-red-600">{stats.criticalEvents + stats.highEvents}</span>
            </div>
            <div className="flex justify-between">
              <span>중간:</span>
              <span className="text-yellow-600">{stats.mediumEvents}</span>
            </div>
            <div className="flex justify-between">
              <span>낮음:</span>
              <span className="text-green-600">{stats.lowEvents}</span>
            </div>
          </div>
        </div>

        {/* 최근 이벤트 */}
        {events.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">최근 이벤트</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {events.slice(-3).map((event, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-xs ${
                    event.severity === "critical" 
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : event.severity === "high"
                      ? "bg-red-50 text-red-700 dark:bg-red-800 dark:text-red-300"
                      : event.severity === "medium"
                      ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300"
                      : "bg-blue-50 text-blue-700 dark:bg-blue-800 dark:text-blue-300"
                  }`}
                >
                  <div className="font-medium">{event.type}</div>
                  <div className="text-xs opacity-75">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 관리자 전용 정보 */}
        {isAdmin && (
          <div className="space-y-1 pt-2 border-t border-border">
            <div className="text-xs font-medium text-muted-foreground">관리자 정보</div>
            <div className="text-xs space-y-1">
              <div>사용자: {userEmail}</div>
              <div>세션: {sessionId?.substring(0, 8)}...</div>
              <div>마지막 이벤트: {stats.lastEventTime ? new Date(stats.lastEventTime).toLocaleString() : "없음"}</div>
            </div>
          </div>
        )}

        {/* 경고 메시지 */}
        {riskScore >= 5 && (
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded text-xs text-red-800 dark:text-red-200">
            ⚠️ 높은 위험 점수로 인해 자동 로그아웃될 수 있습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityDashboard;
