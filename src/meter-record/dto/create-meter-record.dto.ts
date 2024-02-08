import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateMeterRecordItemDto } from "./create-meter-record-item.dto";

export class CreateMeterRecordDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    record_date: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    previous_meterRecord: string;
    
    @ApiProperty()
    @IsArray()
    @IsOptional()
    meterRecordItems: CreateMeterRecordItemDto[];
}