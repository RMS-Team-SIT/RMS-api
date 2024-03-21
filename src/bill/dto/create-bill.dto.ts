import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CreateBillDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  meterRecord: string;

  @ApiProperty()
  @IsString({ each: true })
  @IsNotEmpty()
  meterRecordItems: string[];
}
