import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRenterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastname: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  image: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsPhoneNumber('TH')
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  copyOfIdCard: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  renterContract: string;
}
