import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateRoomDto } from './create-room.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResidentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  defaultWaterPriceRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  defaultLightPriceRate: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => CreateRoomDto)
  @ValidateNested()
  rooms: CreateRoomDto[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  owner: string;
}
