import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { MailService } from 'src/mail/mail.service';
import { JwtStrategy } from './jwt.strategy';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UserService } from 'src/User/user.service';
import { User } from 'src/User/Entity/user.entity';
import { Room } from 'src/app/room/Entity/room.entity';
import { RoomService } from 'src/app/room/room.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Room]),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 40,
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailService, UserService, RoomService],
})
export class AuthModule {}