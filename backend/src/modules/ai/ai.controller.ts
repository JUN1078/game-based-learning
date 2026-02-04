import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from './ai.service';

@Controller('ai')
@UseGuards(AuthGuard('firebase-jwt'))
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-questions')
  generateQuestions(
    @Body()
    request: {
      type: string;
      topic: string;
      difficulty: string;
      imageUrl?: string;
      count?: number;
    },
  ) {
    return this.aiService.generateQuestions(request);
  }

  @Post('generate-asset')
  generateAsset(
    @Body()
    request: {
      type: string;
      prompt: string;
    },
  ) {
    return this.aiService.generateAsset(request);
  }
}
