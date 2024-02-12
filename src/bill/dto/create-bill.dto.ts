import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBillDto {
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    meterRecord: string;
}
