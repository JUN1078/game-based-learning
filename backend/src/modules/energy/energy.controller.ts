import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EnergyService } from './energy.service';
import { EnergyQueryDto } from './dto/energy.dto';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class EnergyController {
  constructor(private readonly energyService: EnergyService) {}

  @Get('daily/energy')
  getDaily(@Request() req, @Query() query: EnergyQueryDto) {
    const date = query.date ? new Date(query.date) : new Date();
    return this.energyService.getDailyEnergy(
      req.user.id,
      date,
      query.neatAdjustment ?? 200,
      query.recoveryModifier ?? 0,
    );
  }

  @Get('weekly/summary')
  getWeekly(@Request() req, @Query() query: EnergyQueryDto) {
    const date = query.date ? new Date(query.date) : new Date();
    return this.energyService.getWeeklySummary(req.user.id, date);
  }
}
