import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateUtilityDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    defaultWaterPriceRate: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    defaultElectricPriceRate: number;
}
