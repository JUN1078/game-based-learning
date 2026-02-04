import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameAttempt } from '../../entities/game-attempt.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(GameAttempt)
    private attemptRepository: Repository<GameAttempt>,
  ) {}

  async getGameAnalytics(gameId: string) {
    const attempts = await this.attemptRepository.find({
      where: { gameId },
    });

    const totalAttempts = attempts.length;
    const completedAttempts = attempts.filter((a) => a.status === 'completed');
    const completionRate = totalAttempts > 0 ? (completedAttempts.length / totalAttempts) * 100 : 0;
    const averageScore = completedAttempts.reduce((sum, a) => sum + a.score, 0) / (completedAttempts.length || 1);
    const averageDuration = completedAttempts.reduce((sum, a) => sum + a.duration, 0) / (completedAttempts.length || 1);

    return {
      gameId,
      totalAttempts,
      completionRate: Math.round(completionRate * 100) / 100,
      averageScore: Math.round(averageScore),
      averageDuration: Math.round(averageDuration),
    };
  }

  async getLeaderboard(gameId: string, limit: number = 10) {
    const attempts = await this.attemptRepository.find({
      where: { gameId, status: 'completed' },
      relations: ['user'],
      order: { score: 'DESC' },
      take: limit,
    });

    return attempts.map((attempt, index) => ({
      rank: index + 1,
      userId: attempt.user.id,
      userName: attempt.user.displayName,
      userPhoto: attempt.user.photoURL,
      score: attempt.score,
      completionTime: attempt.duration,
      accuracy: Math.round((attempt.completedLevels / attempt.totalLevels) * 100),
    }));
  }
}
