import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { User, UserRole } from "../schemas/user.schemas";

export class UpdateUserDto {

    @ApiProperty()
    @IsOptional()
    firstname: string;

    @ApiProperty()
    @IsOptional()
    lastname: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsOptional()
    password: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(Object.values(UserRole), { message: `role must be a valid enum value: [${Object.values(UserRole)}]` })
    role: UserRole;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    age: number;
}
