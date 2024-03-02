import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateRoomTypeDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    size: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    description: string;
}