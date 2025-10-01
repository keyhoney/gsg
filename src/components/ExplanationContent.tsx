import React from "react";
import { MathText } from "./MathText";
import { MathBlock } from "./MathBlock";
import { LazyMathRenderer } from "./LazyMathRenderer";

interface ExplanationContentProps {
  /** 해설 제목 */
  title: string;
  /** 해설 내용 (수식 포함) */
  content: string;
  /** 주요 공식들 */
  formulas?: Array<{
    formula: string;
    title?: string;
    number?: string;
  }>;
  /** 추가 CSS 클래스 */
  className?: string;
}

export const ExplanationContent: React.FC<ExplanationContentProps> = ({
  title,
  content,
  formulas = [],
  className = "",
}) => {
  return (
    <div className={`explanation-content space-y-6 ${className}`}>
      {/* 제목 */}
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </div>

      {/* 주요 공식들 */}
      {formulas.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">주요 공식</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {formulas.map((formula, index) => (
              <div key={index} className="border border-border rounded-lg p-4 bg-card">
                {formula.title && (
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-muted-foreground">{formula.title}</h4>
                    {formula.number && (
                      <span className="text-xs text-muted-foreground">({formula.number})</span>
                    )}
                  </div>
                )}
                <LazyMathRenderer
                  formula={formula.formula}
                  display={true}
                  className="text-center"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 해설 내용 */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div className="text-foreground leading-relaxed">
          <MathText>{content}</MathText>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">참고사항</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 수식을 클릭하면 확대하여 볼 수 있습니다</li>
          <li>• 복잡한 공식은 전체 보기 버튼을 클릭하세요</li>
          <li>• 수식 오류가 있다면 새로고침을 시도해보세요</li>
        </ul>
      </div>
    </div>
  );
};

export default ExplanationContent;
