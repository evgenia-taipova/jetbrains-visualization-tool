export type ResponseCode = 0 | 1 | 2 | 3 | 4 | 5;
export type DefaultType = "multiple" | "boolean";
export type DefaultDifficulty = "easy" | "medium" | "hard";

export interface ApiQuestion {
  type: DefaultType;
  difficulty: DefaultDifficulty;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: readonly string[];
}

export interface ApiQuestionsResponse {
  response_code: ResponseCode;
  results: ApiQuestion[];
}

export interface Question {
  type: DefaultType;
  difficulty: DefaultDifficulty;
  category: string;
  question: string;
  correctAnswer: string;
  incorrectAnswers: readonly string[];
}
