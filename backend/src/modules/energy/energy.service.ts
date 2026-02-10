import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InBodyReport } from '../../entities/inbody-report.entity';
import { CorosUpload } from '../../entities/coros-upload.entity';
import { FoodLog } from '../../entities/food-log.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class EnergyService {
  constructor(
    @InjectRepository(InBodyReport)
    private readonly inBodyRepo: Repository<InBodyReport>,
    @InjectRepository(CorosUpload)
    private readonly corosRepo: Repository<CorosUpload>,
    @InjectRepository(FoodLog)
    private readonly foodRepo: Repository<FoodLog>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getDailyEnergy(userId: string, date: Date, neatAdjustment = 200, recoveryModifier = 0) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const inBody = await this.inBodyRepo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const { start, end } = this.getDayRange(date);
    const corosSessions = await this.corosRepo
      .createQueryBuilder('coros')
      .where('coros.userId = :userId', { userId })
      .andWhere('coros.createdAt BETWEEN :start AND :end', { start, end })
      .getMany();

    const activeCalories = corosSessions.reduce((sum, entry) => sum + entry.activeCalories, 0);
    const leanMass =
      inBody?.fatFreeMass ??
      (inBody?.weight && inBody?.bodyFatPercent
        ? inBody.weight * (1 - inBody.bodyFatPercent / 100)
        : user?.weightKg
          ? user.weightKg * 0.8
          : 60);

    const weight = inBody?.weight ?? user?.weightKg ?? 70;
    const bmr =
      inBody?.bmr ??
      (leanMass ? Math.round(22 * leanMass) : Math.round(24 * weight * 0.9));

    const dailyEnergyNeed = Math.max(0, Math.round(bmr + activeCalories + neatAdjustment + recoveryModifier));
    const protein = Math.round(leanMass * 1.8);
    const fat = Math.round(weight * 0.9);
    const caloriesFromPF = protein * 4 + fat * 9;
    const carbs = Math.max(0, Math.round((dailyEnergyNeed - caloriesFromPF) / 4));

    const foodLogs = await this.foodRepo
      .createQueryBuilder('food')
      .where('food.userId = :userId', { userId })
      .andWhere('food.createdAt BETWEEN :start AND :end', { start, end })
      .getMany();

    const caloriesEaten = foodLogs.reduce((sum, log) => sum + log.calories, 0);

    return {
      date: date.toISOString().slice(0, 10),
      bmr,
      activeCalories,
      neatAdjustment,
      recoveryModifier,
      dailyEnergyNeed,
      caloriesEaten,
      macros: {
        protein,
        fat,
        carbs,
      },
      sources: {
        inBody: inBody ? { id: inBody.id, createdAt: inBody.createdAt } : null,
        corosSessions: corosSessions.length,
        foodLogs: foodLogs.length,
      },
      coaching: this.buildCoachingNote({
        dailyEnergyNeed,
        caloriesEaten,
        protein,
        carbs,
        fat,
        recoveryModifier,
      }),
    };
  }

  async getWeeklySummary(userId: string, endDate: Date) {
    const summary = [];
    for (let i = 6; i >= 0; i -= 1) {
      const day = new Date(endDate);
      day.setDate(endDate.getDate() - i);
      const daily = await this.getDailyEnergy(userId, day);
      summary.push(daily);
    }

    const avgNeed = Math.round(
      summary.reduce((sum, day) => sum + day.dailyEnergyNeed, 0) / summary.length,
    );
    const avgEaten = Math.round(
      summary.reduce((sum, day) => sum + day.caloriesEaten, 0) / summary.length,
    );

    return {
      startDate: summary[0]?.date,
      endDate: summary[summary.length - 1]?.date,
      averageEnergyNeed: avgNeed,
      averageCaloriesEaten: avgEaten,
      days: summary,
      coaching: {
        summary:
          avgEaten < avgNeed
            ? 'Weekly intake below target. Consider adding carbs around training.'
            : 'Weekly intake on track. Maintain current fueling rhythm.',
        warning:
          avgEaten < avgNeed - 300
            ? 'Sustained deficit could impair recovery. Adjust intake.'
            : null,
      },
    };
  }

  private getDayRange(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  private buildCoachingNote(input: {
    dailyEnergyNeed: number;
    caloriesEaten: number;
    protein: number;
    carbs: number;
    fat: number;
    recoveryModifier: number;
  }) {
    const deficit = input.dailyEnergyNeed - input.caloriesEaten;
    if (deficit > 500) {
      return {
        summary: 'You are under target. Add a recovery-focused meal tonight.',
        warning: 'Large deficit detected. Consider a carb-forward dinner.',
      };
    }
    if (deficit < -200) {
      return {
        summary: 'Energy intake exceeds today’s target. Focus on hydration.',
        warning: 'Over target — check portion sizes tomorrow.',
      };
    }
    return {
      summary: 'Energy intake aligned with today’s target.',
      warning: input.recoveryModifier < 0 ? 'Recovery is strained. Prioritize sleep.' : null,
    };
  }
}
