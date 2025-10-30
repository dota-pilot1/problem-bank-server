export class CreateBookmarkDto {
  userId: number;
  testSetId: number;
  subject: 'ENGLISH' | 'MATH';
}

export class BookmarkResponse {
  id: number;
  userId: number;
  testSetId: number;
  subject: string;
  createdAt: Date;
}

export class BookmarkedTestSetResponse {
  bookmarkId: number;
  testSetId: number;
  title: string;
  description?: string;
  gradeLevel: number;
  testType: string;
  totalQuestions: number;
  timeLimit?: number;
  isActive: boolean;
  createdAt: Date;
  bookmarkedAt: Date;
}
