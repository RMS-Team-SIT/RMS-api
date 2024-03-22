import { ApiProperty } from "@nestjs/swagger";
import { BillRoomStatus } from "../enum/bill-room-status.enum";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateBillRoomDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    status?: BillRoomStatus;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    paidEvidenceImage?: string;

}