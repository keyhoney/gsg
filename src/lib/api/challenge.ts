import { api } from "./client";

export interface ChallengeQuestionResponse {
  ok: boolean;
  questions?: {
    id: number;
    book_id: string;
    page: number;
    line: number;
    word_index: number;
  }[];
  message?: string;
}

export interface ChallengeSubmitResponse {
  ok: boolean;
  message: string;
}

export const fetchChallengeQuestions = (bookId: string) =>
  api.get("challenge", { searchParams: { book_id: bookId } }).json<ChallengeQuestionResponse>();

export const submitChallengeAnswers = (
  bookId: string,
  answers: { questionId: number; value: string }[]
) => api.post("challenge", { json: { book_id: bookId, answers } }).json<ChallengeSubmitResponse>();
