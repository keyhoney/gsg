import React, { useMemo } from "react";
import katex from "katex";

interface MathRendererProps {
  /** LaTeX 수식 문자열 */
  formula: string;
  /** 인라인 수식인지 블록 수식인지 */
  display?: boolean;
  /** 에러 발생 시 표시할 메시지 */
  errorMessage?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  formula,
  display = false,
  errorMessage = "수식 렌더링 오류",
  className = "",
}) => {
  const renderedMath = useMemo(() => {
    try {
      const html = katex.renderToString(formula, {
        displayMode: display,
        throwOnError: false,
        errorColor: "#cc0000",
        strict: false,
        trust: false,
        output: "html",
      });
      return html;
    } catch (error) {
      console.error("KaTeX rendering error:", error);
      return null;
    }
  }, [formula, display]);

  if (!renderedMath) {
    return (
      <span className={`inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-sm ${className}`}>
        {errorMessage}
      </span>
    );
  }

  return (
    <span
      className={`math-renderer ${display ? "block" : "inline"} ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedMath }}
    />
  );
};

export default MathRenderer;
