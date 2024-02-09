import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator"

export class CreateMeterRecordItemDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    room: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    @Min(0)
    previousWaterMeter: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    @Min(0)
    previousElectricMeter: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    currentWaterMeter: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    currentElectricMeter: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    totalWaterMeterUsage: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    totalElectricMeterUsage: number;
}