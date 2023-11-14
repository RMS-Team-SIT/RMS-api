import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { PASSWORD_RULE } from "./password.rule";

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    resetPasswordToken: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword(PASSWORD_RULE)
    newPassword: string;
}