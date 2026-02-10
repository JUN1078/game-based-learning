import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FoodService } from './food.service';
import { AiParseService } from './parse.service';
import { FoodLogRequestDto } from './dto/food.dto';

@Controller('food')
@UseGuards(AuthGuard('jwt'))
export class FoodController {
  constructor(
    private readonly foodService: FoodService,
    private readonly parseService: AiParseService,
  ) {}

  @Post('log')
  async logFood(@Request() req, @Body() body: FoodLogRequestDto) {
    const userId = req.user.id;
    if (!body.items || body.items.length === 0) {
      const parsed = await this.parseService.parseFood(body.rawText, body.imageUrl);
      return {
        parsed,
        needsConfirmation: true,
      };
    }
    const saved = await this.foodService.logItems(userId, body.items);
    return { saved };
  }

  @Get('logs')
  list(@Request() req) {
    return this.foodService.listByUser(req.user.id);
  }
}
