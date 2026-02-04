import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from '../../entities/level.entity';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
  ) {}

  async findByGameId(gameId: string): Promise<Level[]> {
    return this.levelRepository.find({
      where: { gameId },
      relations: ['challenges'],
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Level> {
    return this.levelRepository.findOne({
      where: { id },
      relations: ['challenges'],
    });
  }

  async create(gameId: string, levelData: Partial<Level>): Promise<Level> {
    const level = this.levelRepository.create({
      ...levelData,
      gameId,
    });
    return this.levelRepository.save(level);
  }

  async update(id: string, levelData: Partial<Level>): Promise<Level> {
    await this.levelRepository.update(id, levelData);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.levelRepository.delete(id);
  }
}
