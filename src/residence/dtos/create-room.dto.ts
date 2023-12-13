import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateBillDto } from './create-bill.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateRoomDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  floor: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  waterPriceRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
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
  @Min(0)
  currentWaterGauge: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  currentLightGauge: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  currentRenter: Types.ObjectId;

  @ApiProperty()
  @IsOptional()
  @Type(() => CreateBillDto)
  @ValidateNested()
  billHistories: CreateBillDto[];
}
