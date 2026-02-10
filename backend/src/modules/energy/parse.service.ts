import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiParseService {
  private readonly logger = new Logger(AiParseService.name);
  private readonly client: OpenAI | null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
  }

  async parseFood(rawText?: string, imageUrl?: string) {
    if (!this.client) {
      return this.stubFood(rawText);
    }

    const prompt = `
Extract food items from the input. Return JSON only in this exact shape:
{
  "items": [
    {
      "foodName": string,
      "portion": string,
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "confidenceScore": number
    }
  ]
}
If unsure, estimate and reduce confidenceScore.`;

    const responseText = await this.sendParseRequest(prompt, rawText, imageUrl);
    const parsed = this.safeJson(responseText);
    if (parsed?.items) return parsed.items;
    return this.stubFood(rawText);
  }

  async parseInBody(rawText?: string, imageUrl?: string) {
    if (!this.client) {
      return this.stubInBody(rawText);
    }

    const prompt = `
Extract InBody metrics. Return JSON only in this exact shape:
{
  "weight": number,
  "skeletalMuscleMass": number,
  "bodyFatMass": number,
  "bodyFatPercent": number,
  "fatFreeMass": number,
  "totalBodyWater": number,
  "bmr": number,
  "visceralFat": number,
  "ecwRatio": number,
  "confidenceScore": number
}`;

    const responseText = await this.sendParseRequest(prompt, rawText, imageUrl);
    const parsed = this.safeJson(responseText);
    if (parsed?.weight) return parsed;
    return this.stubInBody(rawText);
  }

  async parseCoros(rawText?: string, imageUrl?: string) {
    if (!this.client) {
      return this.stubCoros(rawText);
    }

    const prompt = `
Extract COROS training metrics. Return JSON only in this exact shape:
{
  "activeCalories": number,
  "trainingLoad": number,
  "durationMinutes": number,
  "avgHr": number,
  "maxHr": number,
  "recoveryStatus": string,
  "confidenceScore": number
}`;

    const responseText = await this.sendParseRequest(prompt, rawText, imageUrl);
    const parsed = this.safeJson(responseText);
    if (parsed?.activeCalories) return parsed;
    return this.stubCoros(rawText);
  }

  private async sendParseRequest(prompt: string, rawText?: string, imageUrl?: string) {
    try {
      const content: any[] = [
        { type: 'input_text', text: prompt },
      ];

      if (rawText) {
        content.push({ type: 'input_text', text: `INPUT:\n${rawText}` });
      }
      if (imageUrl) {
        content.push({ type: 'input_image', image_url: imageUrl, detail: 'auto' });
      }

      const response = await this.client!.responses.create({
        model: this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o-mini-2024-07-18',
        input: [
          {
            role: 'user' as const,
            content,
          },
        ],
        temperature: 0.2,
      });

      return this.extractText(response);
    } catch (error) {
      this.logger.warn(`OpenAI parse failed: ${error?.message || error}`);
      return '';
    }
  }

  private extractText(response: any) {
    if (response?.output_text) return response.output_text;
    const output = response?.output || [];
    const textChunks: string[] = [];
    for (const item of output) {
      for (const content of item.content || []) {
        if (content.type === 'output_text' && content.text) {
          textChunks.push(content.text);
        }
      }
    }
    return textChunks.join('\n');
  }

  private safeJson(text: string) {
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}$/);
      if (!match) return null;
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
  }

  private stubFood(rawText?: string) {
    const base = rawText?.toLowerCase() || '';
    if (base.includes('oat')) {
      return [
        {
          foodName: 'Overnight oats',
          portion: '1 jar',
          calories: 380,
          protein: 20,
          carbs: 52,
          fat: 12,
          confidenceScore: 0.86,
        },
      ];
    }
    return [
      {
        foodName: 'Mixed meal',
        portion: '1 serving',
        calories: 520,
        protein: 32,
        carbs: 58,
        fat: 18,
        confidenceScore: 0.82,
      },
    ];
  }

  private stubInBody(rawText?: string) {
    const base = rawText?.toLowerCase() || '';
    const weight = base.includes('70') ? 70.1 : 64.2;
    return {
      weight,
      skeletalMuscleMass: 29.4,
      bodyFatMass: 11.3,
      bodyFatPercent: 17.6,
      fatFreeMass: weight - 11.3,
      totalBodyWater: 38.2,
      bmr: 1540,
      visceralFat: 7,
      ecwRatio: 0.385,
      confidenceScore: 0.88,
    };
  }

  private stubCoros(rawText?: string) {
    const base = rawText?.toLowerCase() || '';
    const activeCalories = base.includes('long') ? 820 : 540;
    return {
      activeCalories,
      trainingLoad: 152,
      durationMinutes: 90,
      avgHr: 148,
      maxHr: 176,
      recoveryStatus: 'Strained',
      confidenceScore: 0.9,
    };
  }
}
