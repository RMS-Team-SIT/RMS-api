import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { UserRole } from '../role/enum/user-role.enum';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  firstname: string;

  @ApiProperty()
  @IsOptional()
  lastname: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Object.values(UserRole), {
    message: `role must be a valid enum value: [${Object.values(UserRole)}]`,
  })
  role: UserRole;

}
