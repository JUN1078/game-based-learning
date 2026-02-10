import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('food_logs')
export class FoodLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.foodLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  foodName: string;

  @Column({ nullable: true })
  portion?: string;

  @Column({ type: 'float' })
  calories: number;

  @Column({ type: 'float', default: 0 })
  protein: number;

  @Column({ type: 'float', default: 0 })
  carbs: number;

  @Column({ type: 'float', default: 0 })
  fat: number;

  @Column({ type: 'float', default: 0.85 })
  confidenceScore: number;

  @CreateDateColumn()
  createdAt: Date;
}
