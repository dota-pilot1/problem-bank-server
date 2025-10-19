export class CreateEnglishProblemDto {
  chapterId: number;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  difficulty: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5';
  questionText: string;
  listeningText?: string; // 듣기 문제용 TTS 텍스트 (선택)
  questionImageUrl?: string; // 문제 이미지 URL (S3)
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  correctAnswer: string;
  explanation?: string;
  tags?: string;
  isActive?: boolean;
}
