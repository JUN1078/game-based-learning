import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
}
