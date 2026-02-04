import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GameService } from './game.service';
import { CreateGameDto, UpdateGameDto } from './dto/game.dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('firebase-jwt'))
  create(@Body() createGameDto: CreateGameDto, @Request() req) {
    return this.gameService.create(createGameDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('firebase-jwt'))
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(id, updateGameDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('firebase-jwt'))
  delete(@Param('id') id: string) {
    return this.gameService.delete(id);
  }

  @Patch(':id/publish')
  @UseGuards(AuthGuard('firebase-jwt'))
  publish(@Param('id') id: string) {
    return this.gameService.publish(id);
  }

  @Post(':id/duplicate')
  @UseGuards(AuthGuard('firebase-jwt'))
  duplicate(@Param('id') id: string, @Request() req) {
    return this.gameService.duplicate(id, req.user.id);
  }
}
