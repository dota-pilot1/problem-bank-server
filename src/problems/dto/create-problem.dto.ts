export class CreateProblemDto {
  subjectId: number;
  chapterId?: number;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  difficulty: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5';
  questionText: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  correctAnswer: string;
  explanation?: string;
  tags?: string;
}
