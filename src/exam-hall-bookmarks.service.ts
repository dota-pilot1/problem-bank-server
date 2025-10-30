import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './drizzle/schema';
import * as englishSchema from './drizzle/schema-english';
import * as mathSchema from './drizzle/schema-math';
import { eq, and } from 'drizzle-orm';
import { DRIZZLE_ORM } from './drizzle/drizzle.module';
import {
  CreateBookmarkDto,
  BookmarkResponse,
  BookmarkedTestSetResponse,
} from './exam-hall-bookmarks.dto';

@Injectable()
export class ExamHallBookmarksService {
  constructor(@Inject(DRIZZLE_ORM) private db: NodePgDatabase<typeof schema>) {}

  async addBookmark(dto: CreateBookmarkDto): Promise<BookmarkResponse> {
    // 중복 체크
    const existing = await this.db
      .select()
      .from(schema.examHallBookmarks)
      .where(
        and(
          eq(schema.examHallBookmarks.userId, dto.userId),
          eq(schema.examHallBookmarks.testSetId, dto.testSetId),
          eq(schema.examHallBookmarks.subject, dto.subject),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('이미 시험장에 추가된 시험입니다');
    }

    // 북마크 추가
    const result = await this.db
      .insert(schema.examHallBookmarks)
      .values({
        userId: dto.userId,
        testSetId: dto.testSetId,
        subject: dto.subject,
      })
      .returning();

    return result[0];
  }

  async getBookmarks(
    userId: number,
    subject: 'ENGLISH' | 'MATH',
  ): Promise<BookmarkedTestSetResponse[]> {
    if (subject === 'ENGLISH') {
      // 영어 시험지 정보와 JOIN
      const bookmarks = await this.db
        .select({
          bookmarkId: schema.examHallBookmarks.id,
          testSetId: englishSchema.englishTestSets.id,
          title: englishSchema.englishTestSets.title,
          description: englishSchema.englishTestSets.description,
          gradeLevel: englishSchema.englishTestSets.gradeLevel,
          testType: englishSchema.englishTestSets.testType,
          totalQuestions: englishSchema.englishTestSets.totalQuestions,
          timeLimit: englishSchema.englishTestSets.timeLimit,
          isActive: englishSchema.englishTestSets.isActive,
          createdAt: englishSchema.englishTestSets.createdAt,
          bookmarkedAt: schema.examHallBookmarks.createdAt,
        })
        .from(schema.examHallBookmarks)
        .innerJoin(
          englishSchema.englishTestSets,
          eq(
            schema.examHallBookmarks.testSetId,
            englishSchema.englishTestSets.id,
          ),
        )
        .where(
          and(
            eq(schema.examHallBookmarks.userId, userId),
            eq(schema.examHallBookmarks.subject, 'ENGLISH'),
          ),
        )
        .orderBy(schema.examHallBookmarks.createdAt);

      return bookmarks.map((b) => ({
        ...b,
        description: b.description ?? undefined,
        gradeLevel: b.gradeLevel ?? 0,
        testType: b.testType ?? 'DAILY',
        timeLimit: b.timeLimit ?? undefined,
      }));
    } else {
      // 수학 시험지 정보와 JOIN
      const bookmarks = await this.db
        .select({
          bookmarkId: schema.examHallBookmarks.id,
          testSetId: mathSchema.mathTestSets.id,
          title: mathSchema.mathTestSets.title,
          description: mathSchema.mathTestSets.description,
          gradeLevel: mathSchema.mathTestSets.gradeLevel,
          testType: mathSchema.mathTestSets.testType,
          totalQuestions: mathSchema.mathTestSets.totalQuestions,
          timeLimit: mathSchema.mathTestSets.timeLimit,
          isActive: mathSchema.mathTestSets.isActive,
          createdAt: mathSchema.mathTestSets.createdAt,
          bookmarkedAt: schema.examHallBookmarks.createdAt,
        })
        .from(schema.examHallBookmarks)
        .innerJoin(
          mathSchema.mathTestSets,
          eq(schema.examHallBookmarks.testSetId, mathSchema.mathTestSets.id),
        )
        .where(
          and(
            eq(schema.examHallBookmarks.userId, userId),
            eq(schema.examHallBookmarks.subject, 'MATH'),
          ),
        )
        .orderBy(schema.examHallBookmarks.createdAt);

      return bookmarks.map((b) => ({
        ...b,
        description: b.description ?? undefined,
        gradeLevel: b.gradeLevel ?? 0,
        testType: b.testType ?? 'MIDTERM',
        timeLimit: b.timeLimit ?? undefined,
      }));
    }
  }

  async deleteBookmark(id: number, userId: number): Promise<void> {
    await this.db
      .delete(schema.examHallBookmarks)
      .where(
        and(
          eq(schema.examHallBookmarks.id, id),
          eq(schema.examHallBookmarks.userId, userId),
        ),
      );
  }
}
