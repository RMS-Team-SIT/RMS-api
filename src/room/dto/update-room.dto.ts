import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
