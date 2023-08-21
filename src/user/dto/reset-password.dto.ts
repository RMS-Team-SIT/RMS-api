import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    resetPasswordToken: string;

    @IsNotEmpty()
    @IsString()
    newPassword: string;
}