import { Controller, Post, Body, Get } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Reservation')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(@Body() dto: CreateReservationDto) {
    return this.reservationService.create(dto);
  }

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }
}
