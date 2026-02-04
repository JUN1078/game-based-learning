import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ChallengeService } from './challenge.service';

@Controller()
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Get('levels/:levelId/challenges')
  findByLevelId(@Param('levelId') levelId: string) {
    return this.challengeService.findByLevelId(levelId);
  }

  @Post('levels/:levelId/challenges')
  create(@Param('levelId') levelId: string, @Body() challengeData: any) {
    return this.challengeService.create(levelId, challengeData);
  }

  @Put('challenges/:id')
  update(@Param('id') id: string, @Body() challengeData: any) {
    return this.challengeService.update(id, challengeData);
  }

  @Delete('challenges/:id')
  delete(@Param('id') id: string) {
    return this.challengeService.delete(id);
  }
}
