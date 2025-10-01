import React, { useState, useEffect } from "react";

interface FontSizeControlProps {
  /** 기본 폰트 크기 */
  defaultSize?: number;
  /** 최소 폰트 크기 */
  minSize?: number;
  /** 최대 폰트 크기 */
  maxSize?: number;
  /** 크기 변경 콜백 */
  onSizeChange?: (size: number) => void;
}

export const FontSizeControl: React.FC<FontSizeControlProps> = ({
  defaultSize = 16,
  minSize = 12,
  maxSize = 24,
  onSizeChange,
}) => {
  const [fontSize, setFontSize] = useState(defaultSize);

  useEffect(() => {
    const saved = localStorage.getItem("font-size");
    if (saved) {
      const size = parseInt(saved);
      if (size >= minSize && size <= maxSize) {
        setFontSize(size);
        document.documentElement.style.setProperty("--content-font-size", `${size}px`);
      }
    } else {
      document.documentElement.style.setProperty("--content-font-size", `${defaultSize}px`);
    }
  }, [defaultSize, minSize, maxSize]);

  const increaseFontSize = () => {
    if (fontSize < maxSize) {
      const newSize = fontSize + 2;
      setFontSize(newSize);
      document.documentElement.style.setProperty("--content-font-size", `${newSize}px`);
      localStorage.setItem("font-size", newSize.toString());
      onSizeChange?.(newSize);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > minSize) {
      const newSize = fontSize - 2;
      setFontSize(newSize);
      document.documentElement.style.setProperty("--content-font-size", `${newSize}px`);
      localStorage.setItem("font-size", newSize.toString());
      onSizeChange?.(newSize);
    }
  };

  const resetFontSize = () => {
    setFontSize(defaultSize);
    document.documentElement.style.setProperty("--content-font-size", `${defaultSize}px`);
    localStorage.setItem("font-size", defaultSize.toString());
    onSizeChange?.(defaultSize);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={decreaseFontSize}
        disabled={fontSize <= minSize}
        className="w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="폰트 크기 줄이기"
      >
        <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium min-w-[2rem] text-center">{fontSize}px</span>
        <button
          onClick={resetFontSize}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          title="기본 크기로 리셋"
        >
          리셋
        </button>
      </div>
      
      <button
        onClick={increaseFontSize}
        disabled={fontSize >= maxSize}
        className="w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="폰트 크기 늘리기"
      >
        <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default FontSizeControl;
