import { ApiProperty } from "@nestjs/swagger";
import { BillRoomStatus } from "../enum/bill-room-status.enum";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateBillRoomStatusDto {
    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    status: boolean;
}