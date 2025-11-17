export class CreateMathProblemDto {
  // 문제 내용
  title?: string;
  passage?: string; // 독해 지문 (영어 독해에만 사용)
  scriptData?: any; // 채팅 스크립트 JSON (대화형 문제용)
  questionText: string; // 문제 본문

  // 선택지 (객관식)
  options?: any; // ["A", "B", "C", "D"] 형태 또는 jsonb
  correctAnswer: string; // 정답

  // 추가 정보
  explanation?: string; // 해설
  difficulty?: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5'; // 난이도
  tags?: string; // 태그 (콤마 구분)

  // 수학 문제용
  formula?: string; // LaTeX 수식

  // 메타 정보
  isActive?: boolean;
  orderIndex?: number; // 시험지 내 정렬
}
