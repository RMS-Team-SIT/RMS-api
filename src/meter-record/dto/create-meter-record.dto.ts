import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateMeterRecordItemDto } from "./create-meter-record-item.dto";
import { Type } from "class-transformer";

export class CreateMeterRecordDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    record_date: Date;

    @ApiProperty({ type: () => [CreateMeterRecordItemDto] })
    @IsNotEmpty()
    @Type(() => CreateMeterRecordItemDto)
    @ValidateNested({ each: true })
    meterRecordItems: CreateMeterRecordItemDto[];
}