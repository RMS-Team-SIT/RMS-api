import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateFeeDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    feename: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    feeprice: number;
}