import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { User } from './user.entity';

@Entity('game_attempts')
export class GameAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.attempts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  gameId: string;

  @ManyToOne(() => Game, (game) => game.attempts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ type: 'int', default: 0 })
  maxScore: number;

  @Column({ type: 'int', default: 0 })
  duration: number;

  @Column({ type: 'int', default: 0 })
  completedLevels: number;

  @Column({ type: 'int', default: 0 })
  totalLevels: number;

  @Column({ type: 'varchar', default: 'in-progress' })
  status: 'in-progress' | 'completed' | 'abandoned';

  @CreateDateColumn()
  startedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
