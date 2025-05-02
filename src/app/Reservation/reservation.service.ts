// src/reservation/reservation.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './Entity/reservation.entity';
import { Room } from '../room/Entity/room.entity';
import { RoomService } from '../room/room.service';
import { UserService } from 'src/User/user.service';

@Injectable()
export class ReservationService {

  constructor(
    @InjectRepository(Reservation)
    private reservationRepo: Repository<Reservation>,
    @InjectRepository(Room)
    private roomRepo: Repository<Room>,
    private readonly roomService: RoomService,
    private readonly userService: UserService
  ) {}

  async create(dto: CreateReservationDto): Promise<Reservation> {
    const room = await this.roomRepo.findOne({ where: { id: dto.roomId } });
    if (!room) throw new NotFoundException('Room not found');

    const user = await this.userService.findById(dto.userId);
    if (!user) throw new NotFoundException('User not found');

    const reservation = this.reservationRepo.create({
      startTime: dto.startTime,
      endTime: dto.endTime,
      room
    });
    await this.roomService.reserve(room.id); 
    return this.reservationRepo.save(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepo.find();
  }
}