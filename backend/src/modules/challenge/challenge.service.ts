import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '../../entities/challenge.entity';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectRepository(Challenge)
    private challengeRepository: Repository<Challenge>,
  ) {}

  async findByLevelId(levelId: string): Promise<Challenge[]> {
    return this.challengeRepository.find({
      where: { levelId },
      order: { order: 'ASC' },
    });
  }

  async create(levelId: string, challengeData: Partial<Challenge>): Promise<Challenge> {
    const challenge = this.challengeRepository.create({
      ...challengeData,
      levelId,
    });
    return this.challengeRepository.save(challenge);
  }

  async update(id: string, challengeData: Partial<Challenge>): Promise<Challenge> {
    await this.challengeRepository.update(id, challengeData);
    return this.challengeRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.challengeRepository.delete(id);
  }
}
