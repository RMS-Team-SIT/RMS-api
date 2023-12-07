import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateResidentContactDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  facebook: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  line: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string;
}
