import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsStrongPassword } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { PASSWORD_RULE } from './password.rule';
import { Exclude } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @ApiProperty()
  @Exclude()
  password: string;

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
}
