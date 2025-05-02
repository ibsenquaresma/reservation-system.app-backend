import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/User/Entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async findByUsername(username: string) {
    return this.userRepo.findOne({ where: { username } });
  }

  async findByEmailOrUsername(email: string, username: string) {
    return this.userRepo.findOne({ where: [{ email }, { username }] });
  }

  async findById(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  async createUser(username: string, email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const newUser = this.userRepo.create({ username, email, password: hash });
    return this.userRepo.save(newUser);
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      //return null;
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async updatePassword(userId: number, newPassword: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    return this.userRepo.save(user);
  }

  async getResetToken(userId: number) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return user.resetToken;
  }

  async updateResetToken(userId: number) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.resetToken = "";
    return this.userRepo.save(user);
  }

  async saveResetToken(userId: number, token: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.resetToken = token;
    return this.userRepo.save(user);
  }

  async updateRefreshToken(userId: number, hashedToken: string) {
    await this.userRepo.update(userId, { refreshToken: hashedToken });
  }
  
}