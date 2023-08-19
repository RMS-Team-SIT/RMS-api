import { ApiProperty } from '@nestjs/swagger';
import { Room } from '../schemas/room.schemas';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRoomUserDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstname: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastname: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    profileImage: string;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isActive: boolean;
}
