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
import { OpenAIGeneratorService } from './services/openai-generator.service';

@Controller('listening-scripts')
export class ListeningScriptsController {
  constructor(
    private readonly listeningScriptsService: ListeningScriptsService,
    private readonly openAIGeneratorService: OpenAIGeneratorService,
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
}
