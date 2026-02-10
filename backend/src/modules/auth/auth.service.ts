import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { User } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(firebaseUid: string, email: string, displayName: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { firebaseUid } });

    if (!user) {
      user = this.userRepository.create({
        firebaseUid,
        email,
        displayName,
        role: 'player',
      });
      await this.userRepository.save(user);
    }

    return user;
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User> {
    return this.userRepository.findOne({ where: { firebaseUid } });
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async registerLocal(data: {
    email: string;
    password: string;
    displayName: string;
    gender?: string;
    dateOfBirth?: string;
    heightCm?: number;
    weightKg?: number;
    goal?: string;
    preferredUnits?: 'metric' | 'imperial';
  }) {
    const existing = await this.userRepository.findOne({ where: { email: data.email } });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const firebaseUid = `local:${randomUUID()}`;

    const user = this.userRepository.create({
      email: data.email,
      displayName: data.displayName,
      firebaseUid,
      passwordHash,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      heightCm: data.heightCm,
      weightKg: data.weightKg,
      goal: data.goal,
      preferredUnits: data.preferredUnits || 'metric',
    });

    await this.userRepository.save(user);

    return this.issueToken(user);
  }

  async loginLocal(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueToken(user);
  }

  async updateProfile(
    userId: string,
    data: {
      displayName?: string;
      gender?: string;
      dateOfBirth?: string;
      heightCm?: number;
      weightKg?: number;
      goal?: string;
      preferredUnits?: 'metric' | 'imperial';
    },
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (data.displayName !== undefined) user.displayName = data.displayName;
    if (data.gender !== undefined) user.gender = data.gender;
    if (data.dateOfBirth !== undefined) user.dateOfBirth = new Date(data.dateOfBirth);
    if (data.heightCm !== undefined) user.heightCm = data.heightCm;
    if (data.weightKg !== undefined) user.weightKg = data.weightKg;
    if (data.goal !== undefined) user.goal = data.goal;
    if (data.preferredUnits !== undefined) user.preferredUnits = data.preferredUnits;

    await this.userRepository.save(user);
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      heightCm: user.heightCm,
      weightKg: user.weightKg,
      goal: user.goal,
      preferredUnits: user.preferredUnits,
    };
  }

  private issueToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        preferredUnits: user.preferredUnits,
      },
    };
  }
}
