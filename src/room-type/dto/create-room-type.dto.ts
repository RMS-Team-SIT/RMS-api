import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { ObjectIdValidator } from 'src/validator/objectIdValidator';

export class CreateRoomTypeDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Validate(ObjectIdValidator)
  _id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  category: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  images: string[];
}
