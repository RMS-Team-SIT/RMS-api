import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateFeeDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  _id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  feename: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  feeprice: number;
}
