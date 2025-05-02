import { IsString, IsNumber, IsBoolean, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ example: 'Meeting Room' })
  @IsString()
  name: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  capacity: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isOccupied?: boolean;

  @ApiProperty({
    example: ['Projector', 'Whiteboard'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  features?: string[];
}