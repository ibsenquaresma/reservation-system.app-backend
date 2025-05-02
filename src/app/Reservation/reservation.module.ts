// src/reservation/reservation.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from './Entity/reservation.entity';
import { Room } from '../room/Entity/room.entity';
import { RoomService } from '../room/room.service';
import { User } from 'src/User/Entity/user.entity';
import { UserService } from 'src/User/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Room, User])],
  providers: [ReservationService, RoomService, UserService],
  controllers: [ReservationController],
})
export class ReservationModule {}