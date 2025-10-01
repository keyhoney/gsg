import React, { useState } from "react";
import { MathRenderer } from "./MathRenderer";

interface MathBlockProps {
  /** LaTeX 수식 문자열 */
  formula: string;
  /** 수식 제목 (선택사항) */
  title?: string;
  /** 수식 번호 (선택사항) */
  number?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

export const MathBlock: React.FC<MathBlockProps> = ({
  formula,
  title,
  number,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`math-block border border-border rounded-lg p-4 bg-card ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
          {number && (
            <span className="text-xs text-muted-foreground">({number})</span>
          )}
        </div>
      )}
      
      <div className="math-content">
        <MathRenderer 
          formula={formula} 
          display={true}
          className="text-center"
        />
      </div>
      
      {formula.length > 100 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? "간략히 보기" : "전체 보기"}
        </button>
      )}
      
      {isExpanded && (
        <div className="mt-2 p-2 bg-muted rounded text-xs font-mono break-all">
          <code>{formula}</code>
        </div>
      )}
    </div>
  );
};

export default MathBlock;
