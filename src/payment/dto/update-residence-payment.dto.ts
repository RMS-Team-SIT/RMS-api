import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateResidencePaymentDto } from './create-residence-payment.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateResidencePaymentDto extends PartialType(
  CreateResidencePaymentDto,
) {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
