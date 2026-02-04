import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../../entities/game.entity';
import { CreateGameDto, UpdateGameDto } from './dto/game.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async findAll(): Promise<Game[]> {
    return this.gameRepository.find({
      relations: ['levels'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['levels', 'levels.challenges'],
    });

    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    return game;
  }

  async create(createGameDto: CreateGameDto, userId: string): Promise<Game> {
    const game = this.gameRepository.create({
      ...createGameDto,
      createdBy: userId,
    });

    return this.gameRepository.save(game);
  }

  async update(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    const game = await this.findOne(id);
    Object.assign(game, updateGameDto);
    return this.gameRepository.save(game);
  }

  async delete(id: string): Promise<void> {
    const result = await this.gameRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
  }

  async publish(id: string): Promise<Game> {
    const game = await this.findOne(id);
    game.status = 'published';
    return this.gameRepository.save(game);
  }

  async duplicate(id: string, userId: string): Promise<Game> {
    const original = await this.findOne(id);

    const duplicate = this.gameRepository.create({
      ...original,
      id: undefined,
      title: `${original.title} (Copy)`,
      status: 'draft',
      createdBy: userId,
    });

    return this.gameRepository.save(duplicate);
  }
}
