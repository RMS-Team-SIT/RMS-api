import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { PASSWORD_RULE } from "./password.rule";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword(PASSWORD_RULE)
    password: string;
}