import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttemptController } from './attempt.controller';
import { AttemptService } from './attempt.service';
import { GameAttempt } from '../../entities/game-attempt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameAttempt])],
  controllers: [AttemptController],
  providers: [AttemptService],
})
export class AttemptModule {}
