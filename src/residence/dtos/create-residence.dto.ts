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
import { ApiProperty } from '@nestjs/swagger';
import { CreateResidenceContactDto } from './create-residence-contact.dto';
import { Type } from 'class-transformer';

export class CreateResidenceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(2500)
  description: string;

  @ApiProperty()
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
  defaultElectricPriceRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => CreateResidenceContactDto)
  @ValidateNested({ each: true })
  contact: CreateResidenceContactDto;
}
