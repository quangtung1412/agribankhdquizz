export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  source: string;
  category: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  questions: Question[];
  createdAt: string;
}

export enum QuizMode {
  Study = 'study',
  Exam = 'exam',
}

export interface QuizSettings {
  categories: string[];
  questionCount: number;
  timeLimit: number; // in seconds
}

export type UserAnswer = {
  questionId: number;
  selectedOptionIndex: number | null;
  isCorrect: boolean | null;
};

export interface QuizAttempt {
  id: string;
  knowledgeBaseId: string;
  knowledgeBaseName: string;
  mode: QuizMode;
  settings: QuizSettings;
  startedAt: string;
  completedAt: string | null;
  userAnswers: UserAnswer[];
  score: number | null; // Stored as percentage, e.g., 85.5
}
