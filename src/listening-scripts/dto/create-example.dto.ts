export class CreateExampleDto {
  categoryId: number;
  title: string;
  description?: string;
  styleType: 'TOEIC' | 'KOREAN_SAT' | 'TEXTBOOK' | 'AMERICAN_SCHOOL' | 'INTERVIEW' | 'NEWS';
  displayOrder?: number;
  messages: CreateExampleMessageDto[];
}

export class CreateExampleMessageDto {
  role: 'USER' | 'CHATBOT';
  message: string;
  displayOrder: number;
}
