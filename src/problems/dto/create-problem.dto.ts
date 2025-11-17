export class CreateProblemDto {
  subjectId: number;
  chapterId?: number;

  // 문제 내용
  title?: string; // 문제 제목 (선택)
  passage?: string; // 독해 지문
  scriptData?: any; // 채팅 스크립트 JSON
  questionText: string; // 문제 본문

  // 선택지 (객관식)
  options?: any; // ["A", "B", "C", "D"] 형태 또는 jsonb
  correctAnswer: string; // 정답

  // 추가 정보
  explanation?: string; // 해설
  difficulty: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5'; // 난이도
  tags?: string; // 태그

  // 수학 문제용
  formula?: string; // LaTeX 수식

  // 메타 정보
  isActive?: boolean;
  orderIndex?: number; // 정렬 순서
}
