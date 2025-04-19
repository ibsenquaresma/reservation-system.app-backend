import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/User/Entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hashed });
    return this.userRepo.save(user);
  }

  // async login(email: string, password: string, res: any) {
  //   const user = await this.userRepo.findOneBy({ email });
  //   if (!user || !(await bcrypt.compare(password, user.password))) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
  //   const accessToken = this.jwtService.sign({ sub: user.id });
  //   const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });
  //   user.refreshToken = refreshToken;
  //   await this.userRepo.save(user);
  //   res.cookie('refreshToken', refreshToken, {
  //     httpOnly: true,
  //     secure: false,
  //     sameSite: 'lax',
  //     maxAge: 7 * 24 * 60 * 60 * 1000,
  //   });
  //   return { accessToken };
  // }

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
  
    return { accessToken: newAccessToken };
  }  
}