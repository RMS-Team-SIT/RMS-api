import { Room } from '../schemas/room.schemas';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRoomUserDto {

    @IsNotEmpty()
    @IsString()
    username: string;
    
    @IsNotEmpty()
    @IsString()
    password: string;
  
    @IsNotEmpty()
    @IsString()
    firstname: string;
  
    @IsNotEmpty()
    @IsString()
    lastname: string;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    phone: string;
  
    @IsOptional()
    @IsString()
    profileImage: string;
  
    @IsOptional()
    @IsBoolean()
    isActive: boolean;
}
