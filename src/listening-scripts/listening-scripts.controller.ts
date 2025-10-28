import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ListeningScriptsService } from './listening-scripts.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateExampleDto } from './dto/create-example.dto';
import { GenerateDailyIssueDto } from './dto/generate-daily-issue.dto';
import { OpenAIGeneratorService } from './services/openai-generator.service';
import { DailyNewsIssueService } from './services/daily-news-issue.service';

@Controller('listening-scripts')
export class ListeningScriptsController {
  constructor(
    private readonly listeningScriptsService: ListeningScriptsService,
    private readonly openAIGeneratorService: OpenAIGeneratorService,
    private readonly dailyNewsIssueService: DailyNewsIssueService,
  ) {}

  // ===== 카테고리 API =====

  @Get('categories')
  async getAllCategories() {
    const categories = await this.listeningScriptsService.findAllCategories();

    // 각 카테고리의 예제 개수 포함
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const exampleCount =
          await this.listeningScriptsService.countExamplesByCategory(
            category.id,
          );
        return {
          id: category.id,
          name: category.name,
          emoji: category.emoji,
          exampleCount,
        };
      }),
    );

    return categoriesWithCount;
  }

  @Post('categories')
  async createCategory(@Body() dto: CreateCategoryDto) {
    return await this.listeningScriptsService.createCategory(dto);
  }

  // ===== 예제 API =====

  @Get('examples')
  async getExamplesByCategory(@Query('categoryId') categoryId: string) {
    const id = parseInt(categoryId, 10);
    if (isNaN(id)) {
      throw new NotFoundException('Invalid category ID');
    }

    const category = await this.listeningScriptsService.findCategoryById(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    const examples =
      await this.listeningScriptsService.findExamplesByCategory(id);

    return {
      category: {
        id: category.id,
        name: category.name,
        emoji: category.emoji,
      },
      examples,
    };
  }

  @Get('examples/:id')
  async getExampleById(@Param('id') id: string) {
    const exampleId = parseInt(id, 10);
    if (isNaN(exampleId)) {
      throw new NotFoundException('Invalid example ID');
    }

    const example =
      await this.listeningScriptsService.findExampleById(exampleId);
    if (!example) {
      throw new NotFoundException(`Example with id ${exampleId} not found`);
    }

    return example;
  }

  @Post('examples')
  async createExample(@Body() dto: CreateExampleDto) {
    return await this.listeningScriptsService.createExample(dto);
  }

  @Post('examples/:id/view')
  async incrementViewCount(@Param('id') id: string) {
    const exampleId = parseInt(id, 10);
    if (isNaN(exampleId)) {
      throw new NotFoundException('Invalid example ID');
    }

    return await this.listeningScriptsService.incrementViewCount(exampleId);
  }

  // ===== GPT 생성 API =====

  @Post('categories/:id/generate')
  async generateExamplesForCategory(@Param('id') id: string) {
    const categoryId = parseInt(id, 10);
    if (isNaN(categoryId)) {
      throw new NotFoundException('Invalid category ID');
    }

    const category =
      await this.listeningScriptsService.findCategoryById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    console.log(
      `📁 카테고리 '${category.name}' ${category.emoji}에 대한 예제 3개 생성 시작`,
    );

    const currentCount =
      await this.listeningScriptsService.countExamplesByCategory(categoryId);

    const styles = ['TOEIC', 'TEXTBOOK', 'AMERICAN_SCHOOL'] as const;

    for (let i = 0; i < 3; i++) {
      const styleType = styles[i % styles.length];

      try {
        console.log(`  🤖 GPT로 ${styleType} 예제 생성 중...`);

        const generated = await this.openAIGeneratorService.generateExample(
          category.name,
          styleType,
        );

        await this.listeningScriptsService.createExample({
          categoryId: category.id,
          title: generated.title,
          description: generated.description,
          styleType: styleType,
          displayOrder: currentCount + i,
          messages: generated.messages.map((msg) => ({
            role: msg.role,
            message: msg.message,
            displayOrder: msg.order,
          })),
        });

        console.log(
          `  ✅ 생성 완료: ${generated.title} (${styleType}) - ${generated.messages.length} 메시지`,
        );

        // API 레이트 리밋 방지
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`  ❌ ${styleType} 예제 생성 실패:`, error.message);
        throw new Error(`예제 생성 실패: ${error.message}`);
      }
    }

    console.log(`✅ 카테고리 '${category.name}' 예제 3개 생성 완료!`);
    return { success: true, message: '예제 3개가 생성되었습니다.' };
  }

  // ===== 오늘의 이슈 API =====

  @Post('daily-issues/generate')
  async generateDailyIssueExamples(@Body() dto: GenerateDailyIssueDto) {
    console.log(
      `📰 오늘의 이슈 '${dto.topicName}' 예제 1개 즉시 생성 시작 (DB 저장 없음)`,
    );

    try {
      console.log('  🤖 GPT-4o로 뉴스형 스타일 생성 중...');

      const generated = await this.openAIGeneratorService.generateExample(
        dto.topicName,
        'NEWS',
      );

      console.log(
        `  ✅ 생성 완료: ${generated.title} (NEWS) - ${generated.messages.length} 메시지`,
      );

      return [
        {
          id: null,
          title: generated.title,
          description: generated.description,
          styleType: 'NEWS',
          styleDisplayName: 'News Broadcast',
          styleDescription: 'Official broadcasting tone',
          messageCount: generated.messages.length,
          viewCount: 0,
          likeCount: 0,
          messages: generated.messages.map((msg) => ({
            role: msg.role,
            message: msg.message,
            order: msg.order,
          })),
        },
      ];
    } catch (error) {
      console.error('  ❌ 뉴스형 예제 생성 실패:', error.message);
      throw new Error(`오늘의 이슈 예제 생성 실패: ${error.message}`);
    }
  }

  @Post('daily-issues/save')
  async saveDailyIssueExample(@Body() example: any) {
    console.log(`💾 오늘의 이슈 예제 저장: ${example.title}`);

    // "저장된 오늘의 이슈" 카테고리 찾기 (displayOrder = 9)
    const categories = await this.listeningScriptsService.findAllCategories();
    const savedIssuesCategory = categories.find(
      (cat) => cat.displayOrder === 9,
    );

    if (!savedIssuesCategory) {
      throw new NotFoundException(
        "'저장된 오늘의 이슈' 카테고리를 찾을 수 없습니다.",
      );
    }

    const currentCount =
      await this.listeningScriptsService.countExamplesByCategory(
        savedIssuesCategory.id,
      );

    const savedExample = await this.listeningScriptsService.createExample({
      categoryId: savedIssuesCategory.id,
      title: example.title,
      description: example.description,
      styleType: example.styleType,
      displayOrder: currentCount,
      messages: example.messages.map((msg: any) => ({
        role: msg.role,
        message: msg.message,
        displayOrder: msg.order,
      })),
    });

    if (!savedExample) {
      throw new Error('예제 저장 실패');
    }

    console.log(`✅ 오늘의 이슈 예제 저장 완료: ID=${savedExample.id}`);
    return savedExample;
  }

  @Get('daily-issues/news')
  async getDailyNewsIssues(@Query('category') category: string) {
    console.log(
      `GET /listening-scripts/daily-issues/news?category=${category} - 실시간 뉴스 이슈 조회`,
    );
    return await this.dailyNewsIssueService.generateDailyIssues(category);
  }
}
