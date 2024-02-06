import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator"

export class CreateMeterRecordItemDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    room: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    oldWaterMeter: number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    newWaterMeter: number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    oldElectricMeter: number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    newElectricMeter: number
}