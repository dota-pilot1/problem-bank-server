export class CreateEnglishProblemDto {
  chapterId?: number;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  difficulty: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5';

  // 문제 내용
  title?: string;
  passage?: string; // 독해 지문
  scriptData?: any; // 채팅 스크립트 JSON
  questionText: string;
  listeningText?: string; // 듣기 문제용 TTS 텍스트 (선택)
  questionImageUrl?: string; // 문제 이미지 URL (S3)

  // 선택지
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  correctAnswer: string;

  // 추가 정보
  explanation?: string;
  tags?: string;
  isActive?: boolean;
}
