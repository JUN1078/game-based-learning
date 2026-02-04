import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async generateQuestions(request: {
    type: string;
    topic: string;
    difficulty: string;
    imageUrl?: string;
    count?: number;
  }): Promise<any> {
    const { type, topic, difficulty, imageUrl, count = 5 } = request;

    let prompt: string;

    if (imageUrl) {
      // Image-based question generation
      prompt = `You are an instructional designer. Based on this image, create ${count} multiple-choice questions.
Focus on observation and interpretation. Each question must include:
- Question text
- 4 options (A, B, C, D)
- Correct answer (letter)
- Brief explanation

Return as JSON array with structure:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "..."
  }
]`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ],
        max_tokens: 1000,
      });

      return JSON.parse(response.choices[0].message.content);
    } else {
      // Text-based question generation
      prompt = `You are an instructional designer.

Generate ${count} multiple-choice questions about:
Topic: ${topic}
Difficulty: ${difficulty}
Audience: General learners

Each question must include:
- Question text
- 4 options
- Correct answer (index 0-3)
- Short explanation
- Difficulty rating
- Tags (array of relevant keywords)

Return as JSON array with structure:
{
  "questions": [
    {
      "question": "...",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": 0,
      "explanation": "...",
      "difficulty": "${difficulty}",
      "tags": ["tag1", "tag2"]
    }
  ]
}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 1500,
      });

      return JSON.parse(response.choices[0].message.content);
    }
  }

  async generateAsset(request: {
    type: string;
    prompt: string;
  }): Promise<{ url: string }> {
    const { prompt } = request;

    const response = await this.openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });

    return {
      url: response.data[0].url,
    };
  }
}
