import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMeterRecordListDto {
    // @IsString()
    // @IsNotEmpty()
    // residence: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    meterRecordListName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    record_date: Date;
}