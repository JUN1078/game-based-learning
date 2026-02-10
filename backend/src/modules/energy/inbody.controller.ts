import { Controller, Post, Body, UseGuards, Request, Get, BadRequestException, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InBodyService } from './inbody.service';
import { AiParseService } from './parse.service';
import { InBodyUploadDto } from './dto/inbody.dto';

@Controller('inbody')
@UseGuards(AuthGuard('jwt'))
export class InBodyController {
  constructor(
    private readonly inBodyService: InBodyService,
    private readonly parseService: AiParseService,
  ) {}

  @Post('upload')
  async upload(@Request() req, @Body() body: InBodyUploadDto) {
    const userId = req.user.id;
    if (!body.weight && !body.rawText) {
      throw new BadRequestException('Missing InBody data');
    }
    if (body.rawText && !body.weight) {
      const parsed = await this.parseService.parseInBody(body.rawText, body.imageUrl);
      return { parsed, needsConfirmation: true };
    }
    const saved = await this.inBodyService.create(userId, body);
    return { saved };
  }

  @Get('latest')
  latest(@Request() req) {
    return this.inBodyService.getLatest(req.user.id);
  }

  @Get('history')
  history(@Request() req, @Query('limit') limit?: string) {
    const take = limit ? Number(limit) : 20;
    return this.inBodyService.listByUser(req.user.id, take);
  }
}
