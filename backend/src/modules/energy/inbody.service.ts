import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InBodyReport } from '../../entities/inbody-report.entity';
import { InBodyUploadDto } from './dto/inbody.dto';

@Injectable()
export class InBodyService {
  constructor(
    @InjectRepository(InBodyReport)
    private readonly reportRepo: Repository<InBodyReport>,
  ) {}

  async create(userId: string, data: InBodyUploadDto) {
    const report = this.reportRepo.create({
      userId,
      weight: data.weight ?? 0,
      skeletalMuscleMass: data.skeletalMuscleMass,
      bodyFatMass: data.bodyFatMass,
      bodyFatPercent: data.bodyFatPercent,
      fatFreeMass: data.fatFreeMass,
      totalBodyWater: data.totalBodyWater,
      bmr: data.bmr,
      visceralFat: data.visceralFat,
      ecwRatio: data.ecwRatio,
    });
    return this.reportRepo.save(report);
  }

  async getLatest(userId: string) {
    return this.reportRepo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async listByUser(userId: string, limit = 20) {
    return this.reportRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
