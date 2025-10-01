import React, { useEffect, useRef, useState } from "react";
import { applyContentProtection, detectDevTools } from "@/lib/content-protection";

interface ContentProtectionProps {
  /** 보호할 콘텐츠 */
  children: React.ReactNode;
  /** 보호 활성화 여부 */
  enabled?: boolean;
  /** 개발자 도구 감지 활성화 */
  detectDevTools?: boolean;
  /** 경고 메시지 */
  warningMessage?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

export const ContentProtection: React.FC<ContentProtectionProps> = ({
  children,
  enabled = true,
  detectDevTools: enableDevToolsDetection = true,
  warningMessage = "개발자 도구 사용이 감지되었습니다. 콘텐츠 보호를 위해 페이지를 새로고침합니다.",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [devToolsDetected, setDevToolsDetected] = useState(false);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    // 콘텐츠 보호 적용
    const cleanup = applyContentProtection(containerRef.current);
    
    return cleanup;
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !enableDevToolsDetection) return;

    // 개발자 도구 감지
    const cleanup = detectDevTools((isOpen) => {
      if (isOpen) {
        setDevToolsDetected(true);
        setShowWarning(true);
        
        // 3초 후 경고 표시
        setTimeout(() => {
          alert(warningMessage);
          // 페이지 새로고침
          window.location.reload();
        }, 3000);
      } else {
        setDevToolsDetected(false);
        setShowWarning(false);
      }
    });

    return cleanup;
  }, [enabled, enableDevToolsDetection, warningMessage]);

  return (
    <div ref={containerRef} className={`content-protected ${className}`}>
      {children}
      
      {showWarning && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-[10000] animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span className="text-sm font-medium">보안 경고</span>
          </div>
          <p className="text-xs mt-1">{warningMessage}</p>
        </div>
      )}
      
      {devToolsDetected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">보안 경고</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              개발자 도구 사용이 감지되었습니다. 콘텐츠 보호를 위해 페이지를 새로고침합니다.
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentProtection;
