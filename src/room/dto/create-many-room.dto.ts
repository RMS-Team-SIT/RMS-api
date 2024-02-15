import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class CreateManyRoomDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  numberOfFloor: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Type(() => Number)
  numberOfRoomEachFloor: number[];

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
  electricPriceRate: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isUseDefaultWaterPriceRate: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isUseDefaultElectricPriceRate: boolean;
}
