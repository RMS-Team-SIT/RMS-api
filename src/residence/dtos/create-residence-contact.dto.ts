import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class CreateResidenceContactDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  facebook: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  line: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @IsPhoneNumber('TH')
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  email: string;
}
