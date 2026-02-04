import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Level } from './level.entity';
import { GameAttempt } from './game-attempt.entity';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ type: 'varchar', default: 'draft' })
  status: 'draft' | 'published' | 'archived';

  @Column({ type: 'varchar', default: 'medium' })
  difficulty: 'easy' | 'medium' | 'hard';

  @Column({ type: 'int', default: 30 })
  estimatedDuration: number;

  @Column({ type: 'int', default: 0 })
  totalLevels: number;

  @Column('simple-array', { nullable: true })
  learningObjectives: string[];

  @Column()
  createdBy: string;

  @OneToMany(() => Level, (level) => level.game, { cascade: true })
  levels: Level[];

  @OneToMany(() => GameAttempt, (attempt) => attempt.game)
  attempts: GameAttempt[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
