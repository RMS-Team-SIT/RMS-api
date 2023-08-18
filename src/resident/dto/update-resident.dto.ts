import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    firstname: string;

    @IsOptional()
    lastname: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    password: string;

    @IsOptional()
    @IsNumber()
    age: number;
}
