import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateRentalDto {
  @IsString()
  @ApiProperty()
  firstname: string;

  @IsString()
  @ApiProperty()
  lastname: string;

  @IsOptional()
  @ApiProperty()
  image: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  phone: string;
}
