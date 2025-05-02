import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './Entity/room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepo: Repository<Room>,
  ) {}

  findAll() {
    return this.roomRepo.find();
  }

  findOne(id: number) {
    return this.roomRepo.findOneBy({ id });
  }

  async create(room: Partial<Room>) {
    const newRoom = this.roomRepo.create(room);
    await this.roomRepo.save(newRoom);
    return { message: 'Room registered successfully' };
  }

  async reserve(id: number) {
    const room = await this.roomRepo.findOneBy({ id });
    if (!room || room.isOccupied) throw new BadRequestException('Room is already occupied');
    room.isOccupied = true;
    return this.roomRepo.save(room);
  }

  async clearReservation(id: number) {
    const room = await this.roomRepo.findOneBy({ id });
    if (!room) return null;
    room.isOccupied = false;
    return this.roomRepo.save(room);
  }
}