import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CorosUpload } from '../../entities/coros-upload.entity';
import { CorosUploadDto } from './dto/coros.dto';

@Injectable()
export class CorosService {
  constructor(
    @InjectRepository(CorosUpload)
    private readonly corosRepo: Repository<CorosUpload>,
  ) {}

  async create(userId: string, data: CorosUploadDto) {
    const upload = this.corosRepo.create({
      userId,
      activeCalories: data.activeCalories,
      trainingLoad: data.trainingLoad,
      durationMinutes: data.durationMinutes,
      avgHr: data.avgHr,
      maxHr: data.maxHr,
      recoveryStatus: data.recoveryStatus,
    });
    return this.corosRepo.save(upload);
  }

  async listForDateRange(userId: string, start: Date, end: Date) {
    return this.corosRepo
      .createQueryBuilder('coros')
      .where('coros.userId = :userId', { userId })
      .andWhere('coros.createdAt BETWEEN :start AND :end', { start, end })
      .getMany();
  }

  async listByUser(userId: string, limit = 20) {
    return this.corosRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
