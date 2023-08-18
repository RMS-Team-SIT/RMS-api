import { IsEmail, IsEnum, IsNotEmpty, IsNumber } from "class-validator";

export class SignInDto {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}
