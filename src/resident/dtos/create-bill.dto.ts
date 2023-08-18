import { Room } from '../schemas/room.schemas';
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBillDto {

    @IsNotEmpty()
    @IsDate()
    date: Date;

    @IsNotEmpty()
    @IsNumber()
    waterPriceRate: number;

    @IsNotEmpty()
    @IsNumber()
    lightPriceRate: number;

    @IsNotEmpty()
    @IsNumber()
    waterGauge: number;

    @IsNotEmpty()
    @IsNumber()
    lightGauge: number;

    @IsNotEmpty()
    @IsNumber()
    waterTotalPrice: number;

    @IsNotEmpty()
    @IsNumber()
    lightTotalPrice: number;

    @IsNotEmpty()
    @IsNumber()
    totalPrice: number;

    @IsOptional()
    @IsString()
    paidEvidenceImage: string;

    @IsOptional()
    @IsBoolean()
    isPaid: boolean;
}
