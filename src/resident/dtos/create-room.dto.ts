import { Room } from '../schemas/room.schemas';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateRoomUserDto } from './create-room-user.dto';
import { CreateBillDto } from './create-bill.dto';
import { Type } from 'class-transformer';

export class CreateRoomDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    waterPriceRate: number;

    @IsNotEmpty()
    @IsNumber()
    lightPriceRate: number;

    @IsNotEmpty()
    @IsNumber()
    currentWaterGauge: number;

    @IsNotEmpty()
    @IsNumber()
    currentLightGauge: number;

    @IsOptional()
    @Type(() => CreateRoomUserDto)
    @ValidateNested()
    roomUsers: CreateRoomUserDto[];

    @IsOptional()
    @Type(() => CreateBillDto)
    @ValidateNested()
    billHistories: CreateBillDto[];
}
