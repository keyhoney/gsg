import React, { useState, useRef, useEffect } from "react";
import { LazyMathRenderer } from "./LazyMathRenderer";

interface EnhancedMathRendererProps {
  /** LaTeX 수식 문자열 */
  formula: string;
  /** 인라인 수식인지 블록 수식인지 */
  display?: boolean;
  /** 에러 발생 시 표시할 메시지 */
  errorMessage?: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 확대 가능 여부 */
  zoomable?: boolean;
  /** 복사 가능 여부 */
  copyable?: boolean;
  /** 번호 표시 */
  number?: string;
}

export const EnhancedMathRenderer: React.FC<EnhancedMathRendererProps> = ({
  formula,
  display = false,
  errorMessage = "수식 렌더링 오류",
  className = "",
  zoomable = true,
  copyable = false,
  number,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoom = () => {
    if (!zoomable) return;
    setIsZoomed(!isZoomed);
  };

  const handleCopy = async () => {
    if (!copyable) return;
    
    try {
      await navigator.clipboard.writeText(formula);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (error) {
      console.error("복사 실패:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && isZoomed) {
      setIsZoomed(false);
    }
  };

  useEffect(() => {
    if (isZoomed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isZoomed]);

  return (
    <>
      <div
        ref={containerRef}
        className={`enhanced-math-renderer ${display ? "block" : "inline"} ${className} ${
          isZoomed ? "fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-8" : ""
        }`}
        onKeyDown={handleKeyDown}
        tabIndex={zoomable ? 0 : -1}
      >
        <div className={`relative ${isZoomed ? "bg-card rounded-2xl p-8 shadow-2xl max-w-4xl max-h-[90vh] overflow-auto" : ""}`}>
          {number && (
            <div className="absolute -left-8 top-0 text-sm text-muted-foreground font-medium">
              ({number})
            </div>
          )}
          
          <LazyMathRenderer
            formula={formula}
            display={display}
            errorMessage={errorMessage}
            className={isZoomed ? "text-2xl" : ""}
          />
          
          {/* 액션 버튼들 */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {zoomable && (
              <button
                onClick={handleZoom}
                className="w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
                title={isZoomed ? "축소" : "확대"}
              >
                <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isZoomed ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  )}
                </svg>
              </button>
            )}
            
            {copyable && (
              <button
                onClick={handleCopy}
                className="w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
                title="수식 복사"
              >
                <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            )}
          </div>
          
          {showCopySuccess && (
            <div className="absolute top-12 right-2 bg-green-500 text-white px-3 py-1 rounded-lg text-sm animate-pulse">
              복사됨!
            </div>
          )}
        </div>
      </div>
      
      {isZoomed && (
        <div
          className="fixed inset-0 z-[9999] bg-black/50"
          onClick={() => setIsZoomed(false)}
        />
      )}
    </>
  );
};

export default EnhancedMathRenderer;
