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
import { ApiProperty } from '@nestjs/swagger';

export class CreateManyRoomDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  numberOfFloor: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  numberOfRoomEachFloor: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  waterPriceRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  roomRentalPrice: number;

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
}
