import { Controller, Post, Body, UseGuards, Request, Get, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CorosService } from './coros.service';
import { AiParseService } from './parse.service';
import { CorosUploadDto } from './dto/coros.dto';

@Controller('coros')
@UseGuards(AuthGuard('jwt'))
export class CorosController {
  constructor(
    private readonly corosService: CorosService,
    private readonly parseService: AiParseService,
  ) {}

  @Post('upload')
  async upload(@Request() req, @Body() body: CorosUploadDto) {
    const userId = req.user.id;
    if ((body.activeCalories === undefined || body.activeCalories === null) && body.rawText) {
      const parsed = await this.parseService.parseCoros(body.rawText, body.imageUrl);
      return { parsed, needsConfirmation: true };
    }
    const saved = await this.corosService.create(userId, body);
    return { saved };
  }

  @Get('history')
  history(@Request() req, @Query('limit') limit?: string) {
    const take = limit ? Number(limit) : 20;
    return this.corosService.listByUser(req.user.id, take);
  }
}
