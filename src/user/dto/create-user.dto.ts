import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsStrongPassword, minLength } from 'class-validator';
import { PASSWORD_RULE } from './password.rule';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
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
