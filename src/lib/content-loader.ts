/**
 * 콘텐츠 파일을 동적으로 로드하는 유틸리티
 */

export interface ProblemMetadata {
  id: string;
  bookId: string;
  page: number;
  problemNumber: number;
  difficulty: string;
  estimatedTime: string;
  concepts: string[];
  keywords: string[];
  qrCode: string;
  relatedProblems: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProblemContent {
  question: string;
  solution: string;
  metadata: ProblemMetadata;
}

/**
 * 문제 콘텐츠를 로드합니다
 */
export async function loadProblemContent(
  bookId: string,
  problemId: string
): Promise<ProblemContent> {
  try {
    // 동적 import를 사용하여 파일 로드
    const questionModule = await import(
      `../content/books/${bookId}/problems/${problemId}/question.md?raw`
    );
    const solutionModule = await import(
      `../content/books/${bookId}/problems/${problemId}/solution.md?raw`
    );
    const metadataModule = await import(
      `../content/books/${bookId}/problems/${problemId}/metadata.json`
    );

    return {
      question: questionModule.default,
      solution: solutionModule.default,
      metadata: metadataModule.default,
    };
  } catch (error) {
    console.error("문제 로드 실패:", error);
    throw new Error(`문제를 불러올 수 없습니다: ${bookId}/${problemId}`);
  }
}

/**
 * 책 메타데이터를 로드합니다
 */
export async function loadBookMetadata(bookId: string) {
  try {
    const metadataModule = await import(
      `../content/books/${bookId}/metadata.json`
    );
    return metadataModule.default;
  } catch (error) {
    console.error("책 메타데이터 로드 실패:", error);
    throw new Error(`책 정보를 불러올 수 없습니다: ${bookId}`);
  }
}
