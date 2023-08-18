import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateRoomDto } from './create-room.dto';
import { Type } from 'class-transformer';

export class CreateResidentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  defaultWaterPriceRate: number;

  @IsNotEmpty()
  @IsNumber()
  defaultLightPriceRate: number;

  @IsOptional()
  @Type(() => CreateRoomDto)
  @ValidateNested()
  rooms: CreateRoomDto[];

  @IsNotEmpty()
  @IsString()
  owner: string;
}
