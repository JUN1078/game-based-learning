import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { GameAttempt } from './game-attempt.entity';
import { InBodyReport } from './inbody-report.entity';
import { CorosUpload } from './coros-upload.entity';
import { FoodLog } from './food-log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  displayName: string;

  @Column({ nullable: true })
  photoURL: string;

  @Column({ type: 'varchar', default: 'player' })
  role: 'player' | 'admin';

  @Column({ unique: true, nullable: true })
  firebaseUid: string;

  @Column({ nullable: true })
  passwordHash?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ type: 'int', nullable: true })
  heightCm?: number;

  @Column({ type: 'float', nullable: true })
  weightKg?: number;

  @Column({ nullable: true })
  goal?: string;

  @Column({ default: 'metric' })
  preferredUnits: 'metric' | 'imperial';

  @OneToMany(() => GameAttempt, (attempt) => attempt.user)
  attempts: GameAttempt[];

  @OneToMany(() => FoodLog, (log) => log.user)
  foodLogs: FoodLog[];

  @OneToMany(() => InBodyReport, (report) => report.user)
  inBodyReports: InBodyReport[];

  @OneToMany(() => CorosUpload, (upload) => upload.user)
  corosUploads: CorosUpload[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
