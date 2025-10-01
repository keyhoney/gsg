import React, { useState, useEffect } from "react";

interface ReadingModeToggleProps {
  /** 읽기 모드 활성화 여부 */
  enabled?: boolean;
  /** 모드 변경 콜백 */
  onModeChange?: (mode: "normal" | "reading") => void;
}

export const ReadingModeToggle: React.FC<ReadingModeToggleProps> = ({
  enabled = true,
  onModeChange,
}) => {
  const [isReadingMode, setIsReadingMode] = useState(false);

  useEffect(() => {
    if (enabled) {
      const saved = localStorage.getItem("reading-mode");
      if (saved === "true") {
        setIsReadingMode(true);
        document.documentElement.classList.add("reading-mode");
      }
    }
  }, [enabled]);

  const toggleReadingMode = () => {
    const newMode = !isReadingMode;
    setIsReadingMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add("reading-mode");
      localStorage.setItem("reading-mode", "true");
    } else {
      document.documentElement.classList.remove("reading-mode");
      localStorage.setItem("reading-mode", "false");
    }
    
    onModeChange?.(newMode ? "reading" : "normal");
  };

  if (!enabled) return null;

  return (
    <button
      onClick={toggleReadingMode}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        isReadingMode
          ? "bg-primary text-primary-foreground shadow-lg"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
      title={isReadingMode ? "일반 모드로 전환" : "읽기 모드로 전환"}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isReadingMode ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        )}
      </svg>
      <span className="text-sm font-medium">
        {isReadingMode ? "읽기 모드" : "일반 모드"}
      </span>
    </button>
  );
};

export default ReadingModeToggle;
