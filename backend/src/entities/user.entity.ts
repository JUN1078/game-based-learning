import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { GameAttempt } from './game-attempt.entity';

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

  @Column({ unique: true })
  firebaseUid: string;

  @OneToMany(() => GameAttempt, (attempt) => attempt.user)
  attempts: GameAttempt[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
