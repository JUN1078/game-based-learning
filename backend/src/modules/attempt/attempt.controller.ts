import { Controller, Get, Post, Put, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttemptService } from './attempt.service';

@Controller()
@UseGuards(AuthGuard('firebase-jwt'))
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  @Post('games/:gameId/attempts')
  start(@Param('gameId') gameId: string, @Request() req, @Body() body: { totalLevels: number }) {
    return this.attemptService.start(gameId, req.user.id, body.totalLevels);
  }

  @Put('attempts/:id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.attemptService.update(id, data);
  }

  @Patch('attempts/:id/complete')
  complete(@Param('id') id: string, @Body() body: { score: number }) {
    return this.attemptService.complete(id, body.score);
  }

  @Get('users/:userId/attempts')
  findByUser(@Param('userId') userId: string) {
    return this.attemptService.findByUser(userId);
  }
}
