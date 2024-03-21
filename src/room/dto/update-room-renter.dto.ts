import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateRoomRenterDto  {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    renterId: string;
}