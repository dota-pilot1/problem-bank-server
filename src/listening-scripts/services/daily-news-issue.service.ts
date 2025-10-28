import { Injectable } from '@nestjs/common';
import {
  GoogleNewsSearchService,
  NewsArticle,
} from './google-news-search.service';

export interface NewsIssue {
  id: string;
  headline: string;
  description: string;
}

@Injectable()
export class DailyNewsIssueService {
  constructor(
    private readonly googleNewsSearchService: GoogleNewsSearchService,
  ) {}

  async generateDailyIssues(category: string): Promise<NewsIssue[]> {
    console.log(
      `🗞️ Google Search를 사용하여 ${category} 카테고리의 실제 뉴스 검색 시작`,
    );

    try {
      const articles: NewsArticle[] =
        await this.googleNewsSearchService.searchNews(category, 5);

      const issues: NewsIssue[] = articles.map((article) => ({
        id: article.id,
        headline: article.title,
        description: article.description,
      }));

      console.log(`✅ ${issues.length}개의 실제 뉴스 이슈 검색 완료`);
      return issues;
    } catch (error) {
      console.error('❌ 뉴스 이슈 검색 실패:', error.message);
      throw new Error('뉴스 이슈 검색 실패');
    }
  }
}
