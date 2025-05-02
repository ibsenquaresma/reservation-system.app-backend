import { IsString, IsNotEmpty, IsNumber, IsEmail, isEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @ApiProperty({ example: '09:00' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '11:00' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  roomId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  userId: number;

}
