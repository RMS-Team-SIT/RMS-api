import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { UserRole } from '../role/enum/user-role.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends CreateUserDto {
  @ApiProperty()
  @IsOptional()
  profileImage: string;
}
