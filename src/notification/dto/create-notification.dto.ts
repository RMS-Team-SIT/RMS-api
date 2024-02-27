import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateNotificationDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    to: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    body: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    isRead: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    isSentEmail: boolean;
}