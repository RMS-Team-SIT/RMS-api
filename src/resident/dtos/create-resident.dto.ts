import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateRoomDto } from './create-room.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateResidentContactDto } from './create-resident-contact.dto';

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
  @IsString()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  images: string[];

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
  contact: CreateResidentContactDto;
}
