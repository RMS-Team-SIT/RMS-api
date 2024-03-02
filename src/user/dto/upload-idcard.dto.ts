import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadIdCardDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idCardNumber: string;
}
