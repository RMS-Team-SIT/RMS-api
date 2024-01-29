import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PaymentType } from "../schemas/payment.schema";

export class CreateResidencePaymentDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(PaymentType)
    type: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    account_number: string;
}