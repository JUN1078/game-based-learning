import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('inbody_reports')
export class InBodyReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.inBodyReports, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'float', nullable: true })
  skeletalMuscleMass?: number;

  @Column({ type: 'float', nullable: true })
  bodyFatMass?: number;

  @Column({ type: 'float', nullable: true })
  bodyFatPercent?: number;

  @Column({ type: 'float', nullable: true })
  fatFreeMass?: number;

  @Column({ type: 'float', nullable: true })
  totalBodyWater?: number;

  @Column({ type: 'float', nullable: true })
  bmr?: number;

  @Column({ type: 'float', nullable: true })
  visceralFat?: number;

  @Column({ type: 'float', nullable: true })
  ecwRatio?: number;

  @CreateDateColumn()
  createdAt: Date;
}
