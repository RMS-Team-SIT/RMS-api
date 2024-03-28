import { ApiProperty } from "@nestjs/swagger";
import { BillRoomStatus } from "../enum/bill-room-status.enum";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateBillRoomPaidEvidenceDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    paidEvidenceImage: string;
}