import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRentalDto {
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
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  copyOfIdCard: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  rentalContract: string;
}
