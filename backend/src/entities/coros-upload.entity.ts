import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('coros_uploads')
export class CorosUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.corosUploads, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'float' })
  activeCalories: number;

  @Column({ type: 'float', nullable: true })
  trainingLoad?: number;

  @Column({ type: 'int', nullable: true })
  durationMinutes?: number;

  @Column({ type: 'int', nullable: true })
  avgHr?: number;

  @Column({ type: 'int', nullable: true })
  maxHr?: number;

  @Column({ nullable: true })
  recoveryStatus?: string;

  @CreateDateColumn()
  createdAt: Date;
}
