import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBillDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    record_date: Date;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    meterRecord: string;
}
