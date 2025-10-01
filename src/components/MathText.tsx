import React, { useMemo } from "react";
import { MathRenderer } from "./MathRenderer";

interface MathTextProps {
  /** 수식이 포함된 텍스트 */
  children: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({
  children,
  className = "",
}) => {
  const processedText = useMemo(() => {
    // 인라인 수식 패턴: $...$ 또는 \(...\)
    const inlinePattern = /\$([^$]+)\$|\\\(([^)]+)\\\)/g;
    // 블록 수식 패턴: $$...$$ 또는 \[...\]
    const blockPattern = /\$\$([^$]+)\$\$|\\\[([^\]]+)\\\]/g;
    
    let result = children;
    const elements: Array<{ type: 'text' | 'inline' | 'block', content: string, key: number }> = [];
    let key = 0;
    
    // 블록 수식 처리
    result = result.replace(blockPattern, (match, content1, content2) => {
      const formula = content1 || content2;
      elements.push({ type: 'block', content: formula, key: key++ });
      return `__BLOCK_MATH_${key - 1}__`;
    });
    
    // 인라인 수식 처리
    result = result.replace(inlinePattern, (match, content1, content2) => {
      const formula = content1 || content2;
      elements.push({ type: 'inline', content: formula, key: key++ });
      return `__INLINE_MATH_${key - 1}__`;
    });
    
    // 텍스트 부분 처리
    const textParts = result.split(/(__BLOCK_MATH_\d+__|__INLINE_MATH_\d+__)/);
    
    return textParts.map((part, index) => {
      const blockMatch = part.match(/__BLOCK_MATH_(\d+)__/);
      const inlineMatch = part.match(/__INLINE_MATH_(\d+)__/);
      
      if (blockMatch) {
        const elementIndex = parseInt(blockMatch[1]);
        const element = elements.find(e => e.key === elementIndex);
        if (element) {
          return (
            <div key={index} className="my-4">
              <MathRenderer formula={element.content} display={true} />
            </div>
          );
        }
      }
      
      if (inlineMatch) {
        const elementIndex = parseInt(inlineMatch[1]);
        const element = elements.find(e => e.key === elementIndex);
        if (element) {
          return (
            <MathRenderer 
              key={index} 
              formula={element.content} 
              display={false}
              className="mx-1"
            />
          );
        }
      }
      
      return part;
    });
  }, [children]);

  return (
    <div className={`math-text ${className}`}>
      {processedText}
    </div>
  );
};

export default MathText;
