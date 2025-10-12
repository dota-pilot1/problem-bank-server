export class CreateMathProblemDto {
  chapterId: number;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  questionText: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  correctAnswer: string;
  explanation?: string;
  tags?: string;
  isActive?: boolean;
}
