import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/User/Entity/user.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) 
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(username: string, email: string, password: string) {
    const existing = await this.userRepo.findOne({ where: [{ email }, { username }] });
    if (existing) throw new UnauthorizedException('User already exists');
  
    const hash = await bcrypt.hash(password, 10);
    const newUser = this.userRepo.create({ username, email, password: hash });
    await this.userRepo.save(newUser);
  
    return { message: 'User registered successfully' };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOneBy({ email });
    console.log("service login");
    if (!user) {
      console.log("service login UnauthorizedException 1");
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log("service login UnauthorizedException 2");

      throw new UnauthorizedException('Invalid credentials');
    }
  
    const accessToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });
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

  async refresh(userId: number, res: any) {
    const user = await this.userRepo.findOneBy({ id: userId });
  
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
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException(user);

    const token = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { expiresIn: '15m' },
    );

    user.resetToken = token;
    // TODO: Send email with reset link
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    
    await this.mailService.sendPasswordReset(user.email, resetLink);

    return { message: 'Reset link sent to your email (check logs).' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepo.findOneBy({ id: payload.sub });

      if (!user) throw new NotFoundException('User not found');

      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
      await this.userRepo.save(user);

      return { message: 'Password reset successfully' };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}