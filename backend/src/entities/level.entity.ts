import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { Challenge } from './challenge.entity';

@Entity('levels')
export class Level {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  gameId: string;

  @ManyToOne(() => Game, (game) => game.levels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @Column({ type: 'int' })
  order: number;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'varchar', default: 'medium' })
  difficulty: 'easy' | 'medium' | 'hard';

  @Column({ type: 'int', default: 70 })
  passingScore: number;

  @OneToMany(() => Challenge, (challenge) => challenge.level, { cascade: true })
  challenges: Challenge[];

  @CreateDateColumn()
  createdAt: Date;
}
