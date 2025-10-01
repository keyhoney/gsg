export interface SessionState {
  authenticated: boolean;
  email?: string;
}

export interface ChallengeQuestion {
  id: number;
  book_id: string;
  page: number;
  line: number;
  word_index: number;
  answer_word: string;
}

export interface ChallengeAttemptPayload {
  book_id: string;
  answers: { questionId: number; value: string }[];
}
