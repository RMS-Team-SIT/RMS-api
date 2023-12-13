import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { PASSWORD_RULE } from "./password.rule";

export class UpdateUserPasswordDto{
    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    oldPassword: string;

    @IsStrongPassword(PASSWORD_RULE)
    @ApiProperty()
    @IsNotEmpty()
    newPassword: string;
}