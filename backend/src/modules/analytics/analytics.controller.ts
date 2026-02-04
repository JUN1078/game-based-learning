import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('games/:gameId')
  getGameAnalytics(@Param('gameId') gameId: string) {
    return this.analyticsService.getGameAnalytics(gameId);
  }

  @Get('games/:gameId/leaderboard')
  getLeaderboard(
    @Param('gameId') gameId: string,
    @Query('limit') limit: string,
  ) {
    return this.analyticsService.getLeaderboard(gameId, parseInt(limit) || 10);
  }
}
