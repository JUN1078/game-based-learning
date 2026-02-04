import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { LevelService } from './level.service';

@Controller()
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Get('games/:gameId/levels')
  findByGameId(@Param('gameId') gameId: string) {
    return this.levelService.findByGameId(gameId);
  }

  @Get('levels/:id')
  findOne(@Param('id') id: string) {
    return this.levelService.findOne(id);
  }

  @Post('games/:gameId/levels')
  create(@Param('gameId') gameId: string, @Body() levelData: any) {
    return this.levelService.create(gameId, levelData);
  }

  @Put('levels/:id')
  update(@Param('id') id: string, @Body() levelData: any) {
    return this.levelService.update(id, levelData);
  }

  @Delete('levels/:id')
  delete(@Param('id') id: string) {
    return this.levelService.delete(id);
  }
}
