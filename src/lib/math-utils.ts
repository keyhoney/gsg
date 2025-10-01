import katex from "katex";

/**
 * LaTeX 수식이 유효한지 검증
 */
export const isValidLatex = (formula: string): boolean => {
  try {
    katex.renderToString(formula, {
      displayMode: false,
      throwOnError: true,
      strict: false,
    });
    return true;
  } catch {
    return false;
  }
};

/**
 * 수식에서 LaTeX 패턴을 추출
 */
export const extractMathPatterns = (text: string): Array<{
  type: 'inline' | 'block';
  formula: string;
  start: number;
  end: number;
}> => {
  const patterns: Array<{
    type: 'inline' | 'block';
    formula: string;
    start: number;
    end: number;
  }> = [];
  
  // 인라인 수식 패턴: $...$ 또는 \(...\)
  const inlineRegex = /\$([^$]+)\$|\\\(([^)]+)\\\)/g;
  let match;
  
  while ((match = inlineRegex.exec(text)) !== null) {
    patterns.push({
      type: 'inline',
      formula: match[1] || match[2],
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  
  // 블록 수식 패턴: $$...$$ 또는 \[...\]
  const blockRegex = /\$\$([^$]+)\$\$|\\\[([^\]]+)\\\]/g;
  
  while ((match = blockRegex.exec(text)) !== null) {
    patterns.push({
      type: 'block',
      formula: match[1] || match[2],
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  
  return patterns.sort((a, b) => a.start - b.start);
};

/**
 * 수식 렌더링 옵션
 */
export const getMathRenderOptions = (display: boolean = false) => ({
  displayMode: display,
  throwOnError: false,
  errorColor: "#cc0000",
  strict: false,
  trust: false,
  output: "html" as const,
});

/**
 * 일반적인 수학 기호와 공식들
 */
export const COMMON_MATH_SYMBOLS = {
  // 그리스 문자
  alpha: "\\alpha",
  beta: "\\beta",
  gamma: "\\gamma",
  delta: "\\delta",
  epsilon: "\\epsilon",
  theta: "\\theta",
  lambda: "\\lambda",
  mu: "\\mu",
  pi: "\\pi",
  sigma: "\\sigma",
  tau: "\\tau",
  phi: "\\phi",
  omega: "\\omega",
  
  // 수학 연산자
  plus: "+",
  minus: "-",
  times: "\\times",
  divide: "\\div",
  equals: "=",
  notEquals: "\\neq",
  lessThan: "<",
  greaterThan: ">",
  lessThanOrEqual: "\\leq",
  greaterThanOrEqual: "\\geq",
  
  // 집합 기호
  in: "\\in",
  notIn: "\\notin",
  subset: "\\subset",
  subsetOrEqual: "\\subseteq",
  union: "\\cup",
  intersection: "\\cap",
  
  // 기타
  infinity: "\\infty",
  partial: "\\partial",
  integral: "\\int",
  sum: "\\sum",
  product: "\\prod",
  limit: "\\lim",
  sqrt: "\\sqrt",
  root: "\\sqrt[n]",
  fraction: "\\frac{a}{b}",
  superscript: "x^{n}",
  subscript: "x_{n}",
};

/**
 * 수식 미리보기 생성
 */
export const generateMathPreview = (formula: string, display: boolean = false): string => {
  try {
    return katex.renderToString(formula, getMathRenderOptions(display));
  } catch (error) {
    console.error("Math preview generation failed:", error);
    return `<span class="text-red-500">수식 오류: ${formula}</span>`;
  }
};
