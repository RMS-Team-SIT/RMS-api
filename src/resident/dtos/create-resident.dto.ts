import { Room } from '../schemas/room.schemas';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
  rooms: Room[];

  @IsNotEmpty()
  @IsString()
  owner: string;
}
