import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateRoomUserDto } from './create-room-user.dto';
import { CreateBillDto } from './create-bill.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateRoomDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  floor: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  waterPriceRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  lightPriceRate: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isUseDefaultWaterPriceRate: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isUseDefaultLightPriceRate: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  currentWaterGauge: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  currentLightGauge: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  currentRental: Types.ObjectId;

  @ApiProperty()
  @IsOptional()
  @Type(() => CreateBillDto)
  @ValidateNested()
  billHistories: CreateBillDto[];
}
