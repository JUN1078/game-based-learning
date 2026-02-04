import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Level } from './level.entity';

@Entity('challenges')
export class Challenge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  levelId: string;

  @ManyToOne(() => Level, (level) => level.challenges, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'levelId' })
  level: Level;

  @Column()
  type: string;

  @Column({ type: 'int' })
  order: number;

  @Column('jsonb')
  config: any;

  @Column({ type: 'int', default: 100 })
  points: number;

  @CreateDateColumn()
  createdAt: Date;
}
