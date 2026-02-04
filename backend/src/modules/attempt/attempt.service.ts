import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameAttempt } from '../../entities/game-attempt.entity';

@Injectable()
export class AttemptService {
  constructor(
    @InjectRepository(GameAttempt)
    private attemptRepository: Repository<GameAttempt>,
  ) {}

  async start(gameId: string, userId: string, totalLevels: number): Promise<GameAttempt> {
    const attempt = this.attemptRepository.create({
      gameId,
      userId,
      totalLevels,
      status: 'in-progress',
    });
    return this.attemptRepository.save(attempt);
  }

  async update(id: string, data: Partial<GameAttempt>): Promise<GameAttempt> {
    await this.attemptRepository.update(id, data);
    return this.attemptRepository.findOne({ where: { id } });
  }

  async complete(id: string, score: number): Promise<GameAttempt> {
    const attempt = await this.attemptRepository.findOne({ where: { id } });
    attempt.score = score;
    attempt.status = 'completed';
    attempt.completedAt = new Date();
    return this.attemptRepository.save(attempt);
  }

  async findByUser(userId: string): Promise<GameAttempt[]> {
    return this.attemptRepository.find({
      where: { userId },
      relations: ['game'],
      order: { startedAt: 'DESC' },
    });
  }
}
