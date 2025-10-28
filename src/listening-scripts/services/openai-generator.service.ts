import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

type ScriptStyleType =
  | 'TOEIC'
  | 'KOREAN_SAT'
  | 'TEXTBOOK'
  | 'AMERICAN_SCHOOL'
  | 'INTERVIEW'
  | 'NEWS';

interface GeneratedMessage {
  role: 'USER' | 'CHATBOT';
  message: string;
  order: number;
}

interface GeneratedExample {
  title: string;
  description: string;
  messages: GeneratedMessage[];
}

@Injectable()
export class OpenAIGeneratorService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly model = 'gpt-4o';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
  }

  async generateExample(
    categoryName: string,
    styleType: ScriptStyleType,
  ): Promise<GeneratedExample> {
    console.log(
      `🤖 GPT-4o로 예제 생성 시작 - 카테고리: ${categoryName}, 스타일: ${styleType}`,
    );

    // API 키가 없으면 더미 데이터 반환
    if (!this.apiKey) {
      console.log('⚠️ OpenAI API 키가 없습니다. 더미 데이터를 반환합니다.');
      return this.generateDummyExample(categoryName, styleType);
    }

    const prompt = this.buildPrompt(categoryName, styleType);

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content:
                'You are an expert English conversation script writer specializing in listening comprehension materials. ' +
                'You create natural, educational dialogues for language learners.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_completion_tokens: 1500,
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const content = response.data.choices[0].message.content;
      const result: GeneratedExample = JSON.parse(content);

      console.log(
        `✅ GPT-4o 예제 생성 완료 - 제목: ${result.title}, 메시지 수: ${result.messages.length}`,
      );

      return result;
    } catch (error) {
      console.error('❌ GPT-4o 예제 생성 실패:', error.message);
      throw new Error(`예제 생성 중 오류 발생: ${error.message}`);
    }
  }

  private buildPrompt(
    categoryName: string,
    styleType: ScriptStyleType,
  ): string {
    const styleGuidelines = this.getStyleGuidelines(styleType);

    return `Create an English listening comprehension dialogue with these specifications:

**Category**: ${categoryName}
**Style**: ${styleType} (${this.getStyleDescription(styleType)})

**Requirements**:
1. **Conversation Length**: 4-8 turns (alternating speakers)
2. **Speaker Roles**:
   - USER: Can be waiter, receptionist, teacher, etc. (service provider)
   - CHATBOT: Can be customer, student, patient, etc. (service receiver)
3. **Natural Dialogue**: Use realistic, conversational English appropriate for the style
4. **Specific Details**: Include numbers, times, places, prices when relevant
5. **Clear Structure**: Each message should be clear and purposeful

**Style Guidelines for ${styleType}**:
${styleGuidelines}

**Output Format** (JSON):
{
  "title": "Brief descriptive title (e.g., 'Restaurant Order', 'Coffee Shop')",
  "description": "Short description of the scenario",
  "messages": [
    {"role": "USER", "message": "First speaker's message", "order": 1},
    {"role": "CHATBOT", "message": "Second speaker's response", "order": 2},
    {"role": "USER", "message": "Next message...", "order": 3}
  ]
}

**Important**: Return ONLY valid JSON, no additional text.`;
  }

  private getStyleDescription(styleType: ScriptStyleType): string {
    const descriptions = {
      TOEIC: 'Professional business English',
      KOREAN_SAT: 'Korean SAT English exam style',
      TEXTBOOK: 'Standard textbook dialogue',
      AMERICAN_SCHOOL: 'Authentic American school conversation',
      INTERVIEW: 'Professional interview format',
      NEWS: 'News broadcast style',
    };
    return descriptions[styleType];
  }

  private getStyleGuidelines(styleType: ScriptStyleType): string {
    const guidelines = {
      TOEIC:
        '- Use professional business English\n' +
        '- Include workplace scenarios (meetings, phone calls, announcements)\n' +
        '- Clear pronunciation, moderate speed\n' +
        '- Formal and polite language',
      KOREAN_SAT:
        '- School or daily life situations\n' +
        '- Clear information delivery (time, place, purpose)\n' +
        '- Moderate speed, high school level vocabulary\n' +
        '- Polite and straightforward',
      TEXTBOOK:
        '- Basic pattern practice\n' +
        '- Standard grammar, complete sentences\n' +
        '- No slang, clear pronunciation\n' +
        '- Simple and repetitive for learning',
      AMERICAN_SCHOOL:
        '- Authentic American school dialogue\n' +
        '- Natural speaking speed, casual tone\n' +
        '- Include slang, idioms, contractions\n' +
        '- Realistic youth conversation',
      INTERVIEW:
        '- Professional question-answer format\n' +
        '- Detailed explanations (3-5 sentences per answer)\n' +
        '- Topics: career, experience, opinions\n' +
        '- Formal but conversational',
      NEWS:
        '- Official broadcasting tone\n' +
        '- Factual information delivery (5W1H)\n' +
        '- Fast-paced, professional vocabulary\n' +
        '- News report or announcement style',
    };
    return guidelines[styleType];
  }

  private generateDummyExample(
    categoryName: string,
    styleType: ScriptStyleType,
  ): GeneratedExample {
    return {
      title: `${categoryName} - ${styleType} 예제 (더미 데이터)`,
      description: `${categoryName} 상황에서 ${styleType} 스타일로 진행되는 대화 예제입니다. (OpenAI API 키가 없어 더미 데이터를 생성했습니다)`,
      messages: [
        {
          role: 'USER',
          message: `Hello! Welcome to our ${categoryName.toLowerCase()}. How can I help you today?`,
          order: 1,
        },
        {
          role: 'CHATBOT',
          message: `Hi! I'd like some information about your services.`,
          order: 2,
        },
        {
          role: 'USER',
          message: `Of course! We offer a variety of services. What specifically are you interested in?`,
          order: 3,
        },
        {
          role: 'CHATBOT',
          message: `Could you tell me more about your most popular options?`,
          order: 4,
        },
        {
          role: 'USER',
          message: `Certainly! Our most popular service is our premium package, which includes everything you need.`,
          order: 5,
        },
        {
          role: 'CHATBOT',
          message: `That sounds great! How much does it cost?`,
          order: 6,
        },
        {
          role: 'USER',
          message: `The premium package is $99 per month. Would you like to sign up?`,
          order: 7,
        },
        {
          role: 'CHATBOT',
          message: `Yes, I'd like to proceed. Thank you for your help!`,
          order: 8,
        },
      ],
    };
  }
}
