import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateRoomUserDto } from './create-room-user.dto';
import { CreateBillDto } from './create-bill.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsNotEmpty()
  @IsNumber()
  waterPriceRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  lightPriceRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  currentWaterGauge: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  currentLightGauge: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => CreateBillDto)
  @ValidateNested()
  billHistories: CreateBillDto[];
}
