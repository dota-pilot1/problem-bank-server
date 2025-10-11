export class CreateTestSetDto {
  title: string;
  description?: string;
  subjectId?: number;
  testType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'MIDTERM' | 'FINAL' | 'MOCK';
  totalQuestions?: number;
  timeLimit?: number;
}
