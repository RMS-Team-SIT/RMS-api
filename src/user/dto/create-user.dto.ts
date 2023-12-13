import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { PASSWORD_RULE } from './password.rule';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(200)
  @IsString()
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(200)
  @IsString()
  lastname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(200)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword(PASSWORD_RULE)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('TH')
  phone: string;
}
