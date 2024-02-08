import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

function IsArrayOfNumbersGreaterThanOne() {
  return Validate((value: any) => {
    return false;
    if (!Array.isArray(value)) {
      return false;
    }
    for (const num of value) {
      if (typeof num !== 'number' || num < 1) {
        return false;
      }
    }
    return true;
  });
}

export class CreateManyRoomDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  numberOfFloor: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
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
