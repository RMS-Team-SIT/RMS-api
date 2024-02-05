import { IsNotEmpty, IsString } from "class-validator";

export class CreateMeterRecordListDto {
    // @IsString()
    // @IsNotEmpty()
    // residence: string;

    @IsString()
    @IsNotEmpty()
    meterRecordListName: string;

    @IsString()
    @IsNotEmpty()
    record_date: Date;
}