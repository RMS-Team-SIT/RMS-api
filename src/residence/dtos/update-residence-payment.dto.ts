import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateResidencePaymentDto } from "./create-residence-payment.dto";

export class UpdateResidencePaymentDto extends PartialType(CreateResidencePaymentDto) {

}