import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodLog } from '../../entities/food-log.entity';
import { FoodLogItemDto } from './dto/food.dto';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(FoodLog)
    private readonly foodRepo: Repository<FoodLog>,
  ) {}

  async logItems(userId: string, items: FoodLogItemDto[]) {
    const rows = items.map((item) =>
      this.foodRepo.create({
        userId,
        foodName: item.foodName,
        portion: item.portion,
        calories: item.calories,
        protein: item.protein ?? 0,
        carbs: item.carbs ?? 0,
        fat: item.fat ?? 0,
        confidenceScore: item.confidenceScore ?? 0.85,
      }),
    );
    return this.foodRepo.save(rows);
  }

  async listByUser(userId: string, limit = 50) {
    return this.foodRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
