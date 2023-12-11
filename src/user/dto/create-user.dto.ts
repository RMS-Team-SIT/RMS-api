import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsStrongPassword,
  Max,
  MaxLength,
  minLength,
} from 'class-validator';
import { PASSWORD_RULE } from './password.rule';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(200)
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(200)
  lastname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(200)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword(PASSWORD_RULE)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('TH')
  phone: string;
}
