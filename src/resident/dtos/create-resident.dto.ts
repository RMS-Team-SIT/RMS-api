import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
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
  @MaxLength(200)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  images: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  defaultWaterPriceRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  defaultLightPriceRate: number;

  @ApiProperty()
  @IsOptional()
  contact: CreateResidentContactDto;
}
