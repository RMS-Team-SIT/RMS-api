import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { PaymentType } from '../schemas/payment.schema';
import { ObjectIdValidator } from 'src/validator/objectIdValidator';

export class CreateResidencePaymentDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PaymentType)
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bankId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  account_number: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  account_name: string;
}
