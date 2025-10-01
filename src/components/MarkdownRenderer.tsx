import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";

interface MarkdownRendererProps {
  /** 마크다운 콘텐츠 */
  content: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 마크다운과 수학 수식을 함께 렌더링하는 컴포넌트
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // 제목 스타일링
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold mt-5 mb-2 text-foreground" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-lg font-semibold mt-4 mb-2 text-foreground" {...props} />
          ),
          // 단락 스타일링
          p: ({ node, ...props }) => (
            <p className="mb-4 leading-relaxed text-foreground" {...props} />
          ),
          // 리스트 스타일링
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-foreground" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="ml-4 text-foreground" {...props} />
          ),
          // 코드 블록 스타일링
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono text-foreground" {...props} />
            ) : (
              <code className="block p-4 bg-muted rounded-lg overflow-x-auto text-sm font-mono text-foreground mb-4" {...props} />
            ),
          // 인용구 스타일링
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-primary pl-4 py-2 my-4 italic text-muted-foreground bg-muted/30 rounded-r"
              {...props}
            />
          ),
          // 링크 스타일링
          a: ({ node, ...props }) => (
            <a className="text-primary hover:underline" {...props} />
          ),
          // 수평선 스타일링
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-border" {...props} />
          ),
          // 강조 스타일링
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-foreground" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-foreground" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

