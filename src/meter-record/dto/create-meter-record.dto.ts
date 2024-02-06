import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMeterRecordDto {
    // @IsString()
    // @IsNotEmpty()
    // residence: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    meterRecordName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    record_date: Date;
}