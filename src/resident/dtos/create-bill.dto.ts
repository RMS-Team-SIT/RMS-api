import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBillDto {
  @ApiProperty()
  @IsNotEmpty()
  date: Date;

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
  waterGauge: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  lightGauge: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  waterTotalPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  lightTotalPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  paidEvidenceImage: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPaid: boolean;
}
