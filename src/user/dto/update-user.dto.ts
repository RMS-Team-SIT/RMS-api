import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../role/enum/user-role.enum';
import { CreateUserDto } from './create-user.dto';
import { PASSWORD_RULE } from './password.rule';
import { Exclude } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsOptional()
  profileImage: string;

  @ApiProperty()
  @IsOptional()
  oldPassword: string;

  @ApiProperty()
  @IsOptional()
  @IsStrongPassword(PASSWORD_RULE)
  newPassword: string;

  @Exclude()
  email?: string;
}
