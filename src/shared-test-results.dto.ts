export class SubmitTestDto {
  testSetId: number;
  userId?: number; // 로그인한 사용자
  guestId?: string; // 비로그인 사용자 UUID
  userName: string; // 사용자 이름
  timeSpentSeconds?: number;
  answers: AnswerDto[];
}

export class AnswerDto {
  problemId: number;
  selectedAnswer: string;
}

export class TestResultResponse {
  id: number;
  testSetId: number;
  userName: string;
  totalScore: number;
  earnedScore: number;
  percentage: number;
  rank: number;
  totalParticipants: number;
  timeSpentSeconds?: number;
  completedAt: Date;
  questionResults: QuestionResultDto[];
  isGuest: boolean;
}

export class QuestionResultDto {
  problemId: number;
  questionText: string;
  selectedAnswer?: string;
  correctAnswer: string;
  isCorrect: boolean;
  score: number;
}

export class RankingResponse {
  testSetId: number;
  testTitle: string;
  totalParticipants: number;
  rankings: RankEntryDto[];
}

export class RankEntryDto {
  rank: number;
  userName: string;
  earnedScore: number;
  totalScore: number;
  percentage: number;
  completedAt: Date;
  isMe: boolean;
}
