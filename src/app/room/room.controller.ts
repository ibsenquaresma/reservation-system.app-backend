import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './Entity/room.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoomDto } from './dto/ReserveRoomDto';

@ApiTags('rooms')
@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get('findAll')
  findAll(): Promise<Room[]> {
    return this.roomService.findAll();
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new room' })
  create(@Body() dto:CreateRoomDto) {
    return this.roomService.create(dto);
  }

  @Patch(':id/reserve')
  reserve(@Param('id') id: string) {
    return this.roomService.reserve(+id);
  }

  @Patch(':id/clear')
  clear(@Param('id') id: string) {
    return this.roomService.clearReservation(+id);
  }
}