import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/User/Entity/user.entity';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/User/user.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) 
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
    private readonly userService: UserService,
  ) {}

  async register(username: string, email: string, password: string) {
    const existingUser = await this.userService.findByEmail(email) || await this.userService.findByUsername(username);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    await this.userService.createUser(username, email, password);
    return { message: 'User registered successfully' };
  }

  async validateUser(email: string, password: string): Promise<any> {
    console.log("validateUser");
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { id: user.id, username: user.username, email: user.email };
  }

  async login(email: string, password: string) {
    const user = await this.userService.validateUser(email, password);
    console.log("service login");
    if (!user) {
      console.log("service login UnauthorizedException 1");
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign({ payload }, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign({ payload }, { expiresIn: '7d' });
    console.log("service login accessToken " + accessToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async logout(response: any) {
    response.clearCookie('refreshToken');
    response.clearCookie('accessToken');
    console.log("Logout successful")
    return { message: 'Logout successful' };
  }

  async refresh(userId: number, res: any) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    const newAccessToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '15m' },
    );
  
    // Se estiver usando cookies seguros, set cookie aqui:
    // res.cookie('access_token', newAccessToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'strict',
    //   maxAge: 15 * 60 * 1000,
    // });
    console.log('refresh');
    return { accessToken: newAccessToken };
  }

  //forgot password
  async sendResetToken(email: string) {
    console.log("Method sendResetToken: ");
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const token = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { expiresIn: '15m' },
    );
    await this.userService.saveResetToken(user.id, token);

    user.resetToken = token;
    // TODO: Send email with reset link
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    await this.mailService.sendPasswordReset(user.email, resetLink);

    return { message: 'Reset link sent to your email (check logs).' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);
      await this.userService.updatePassword(payload.sub, newPassword);
      return { message: 'Password reset successfully' };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}