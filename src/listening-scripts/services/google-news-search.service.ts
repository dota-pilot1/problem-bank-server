import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
}

@Injectable()
export class GoogleNewsSearchService {
  private readonly googleApiKey: string;
  private readonly searchEngineId: string;
  private readonly apiUrl = 'https://www.googleapis.com/customsearch/v1';

  constructor(private configService: ConfigService) {
    this.googleApiKey = this.configService.get<string>('GOOGLE_API_KEY') || '';
    this.searchEngineId =
      this.configService.get<string>('GOOGLE_SEARCH_ENGINE_ID') || '';
  }

  async searchNews(category: string, maxResults: number = 5): Promise<NewsArticle[]> {
    try {
      // API 키가 없으면 더미 데이터 반환
      if (!this.googleApiKey || !this.searchEngineId) {
        console.warn(
          '⚠️ Google API 키가 설정되지 않음. 더미 데이터를 반환합니다.',
        );
        return this.generateDummyNews(category, maxResults);
      }

      const query = this.buildSearchQuery(category);
      console.log(`🔍 Google 뉴스 검색 시작: ${query}`);

      const response = await axios.get(this.apiUrl, {
        params: {
          key: this.googleApiKey,
          cx: this.searchEngineId,
          q: query,
          num: maxResults,
          sort: 'date',
          lr: 'lang_ko',
        },
      });

      const articles = this.parseSearchResults(response.data);
      console.log(`✅ ${articles.length}개의 뉴스 기사 검색 완료`);
      return articles;
    } catch (error) {
      console.error('❌ Google 뉴스 검색 실패:', error.message);
      return this.generateDummyNews(category, maxResults);
    }
  }

  private buildSearchQuery(category: string): string {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    const keywords: Record<string, string> = {
      'IT/테크': 'IT 기술 AI 스타트업',
      '정치/사회': '정치 사회 이슈',
      '경제/금융': '경제 금융 주식 시장',
      스포츠: '스포츠 축구 야구',
      '연예/문화': '연예 영화 드라마 K-POP',
      '과학/환경': '과학 환경 기후변화',
      교육: '교육 입시 대학',
      라이프스타일: '건강 여행 음식 라이프',
    };

    const keyword = keywords[category] || category;
    return `${keyword} 뉴스 ${dateStr}`;
  }

  private parseSearchResults(data: any): NewsArticle[] {
    const articles: NewsArticle[] = [];

    if (!data.items) {
      return articles;
    }

    let id = 1;
    for (const item of data.items) {
      const title = this.cleanTitle(item.title || '');
      const snippet = item.snippet || '';
      const description =
        snippet.length > 100 ? snippet.substring(0, 100) + '...' : snippet;

      articles.push({
        id: `news-${id++}`,
        title,
        description,
      });

      if (articles.length >= 5) break;
    }

    return articles;
  }

  private cleanTitle(title: string): string {
    // HTML 태그 제거
    title = title.replace(/<[^>]*>/g, '');
    // 불필요한 기호 제거
    title = title.replace(/[\[\]()]/g, '');
    // 연속된 공백 제거
    title = title.replace(/\s+/g, ' ').trim();
    return title;
  }

  private generateDummyNews(
    category: string,
    maxResults: number,
  ): NewsArticle[] {
    console.log(`📝 더미 뉴스 데이터 생성: ${category}`);

    const today = new Date();
    const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

    const dummyData: Record<string, NewsArticle[]> = {
      'IT/테크': [
        {
          id: 'dummy-1',
          title: '국내 AI 스타트업, 글로벌 시장 진출 본격화',
          description: `${dateStr} - 한국의 인공지능 기업들이 해외 시장 공략에 나섰습니다.`,
        },
        {
          id: 'dummy-2',
          title: '삼성전자, 차세대 반도체 기술 개발 성공',
          description: `${dateStr} - 3나노 공정 기술로 업계 선도를 이어갑니다.`,
        },
        {
          id: 'dummy-3',
          title: '메타버스 플랫폼, 교육 분야 적용 확대',
          description: `${dateStr} - 가상현실 기술이 교육 혁신을 이끌고 있습니다.`,
        },
        {
          id: 'dummy-4',
          title: '클라우드 서비스 시장 급성장, 보안 강화 필수',
          description: `${dateStr} - 기업들의 클라우드 전환이 가속화되고 있습니다.`,
        },
        {
          id: 'dummy-5',
          title: '전기차 배터리 기술 혁신, 충전 시간 단축',
          description: `${dateStr} - 신기술로 10분 내 80% 충전 가능해졌습니다.`,
        },
      ],
      '경제/금융': [
        {
          id: 'dummy-1',
          title: '코스피, 외국인 매수세에 2600선 회복',
          description: `${dateStr} - 글로벌 경기 회복 기대감이 반영되었습니다.`,
        },
        {
          id: 'dummy-2',
          title: '한국은행 기준금리 동결 결정',
          description: `${dateStr} - 물가 안정세를 고려한 신중한 접근입니다.`,
        },
        {
          id: 'dummy-3',
          title: '부동산 거래량 증가, 시장 회복 조짐',
          description: `${dateStr} - 규제 완화 기대감에 매수세가 살아나고 있습니다.`,
        },
        {
          id: 'dummy-4',
          title: '암호화폐 시장 변동성 확대',
          description: `${dateStr} - 비트코인 가격 변동이 투자자들의 관심을 끌고 있습니다.`,
        },
        {
          id: 'dummy-5',
          title: '중소기업 금융지원 정책 발표',
          description: `${dateStr} - 정부가 중소기업 자금난 해소에 나섰습니다.`,
        },
      ],
    };

    const categoryNews = dummyData[category] || [];
    if (categoryNews.length > 0) {
      return categoryNews.slice(0, Math.min(maxResults, categoryNews.length));
    }

    // 기본 더미 데이터
    const defaultNews: NewsArticle[] = [];
    for (let i = 1; i <= Math.min(maxResults, 5); i++) {
      defaultNews.push({
        id: `dummy-${i}`,
        title: `${category} 관련 최신 이슈 ${i}`,
        description: `${dateStr} - ${category} 분야의 주요 뉴스입니다.`,
      });
    }

    return defaultNews;
  }
}
