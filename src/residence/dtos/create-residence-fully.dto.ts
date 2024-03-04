import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateResidenceContactDto } from './create-residence-contact.dto';
import { Type } from 'class-transformer';
import { CreateFeeDto } from 'src/fees/dto/create-fee.dto';
import { CreateResidencePaymentDto } from 'src/payment/dto/create-residence-payment.dto';
import { CreateRoomTypeDto } from 'src/room-type/dto/create-room-type.dto';
import { CreateRoomDto } from 'src/room/dto/create-room.dto';

export class CreateResidenceFullyDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    name: string;

    @ApiProperty()
    @IsString()
    @MaxLength(2500)
    description: string;

    @ApiProperty()
    @IsString()
    @MaxLength(500)
    address: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    images: string[];

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    residenceBusinessLicense: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    defaultWaterPriceRate: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    defaultElectricPriceRate: number;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => CreateResidenceContactDto)
    @ValidateNested({ each: true })
    contact: CreateResidenceContactDto;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    facilities: string[];

    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    @Type(() => CreateFeeDto)
    @ValidateNested({ each: true })
    fees: CreateFeeDto[];

    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    @Type(() => CreateResidencePaymentDto)
    @ValidateNested({ each: true })
    payments: CreateResidencePaymentDto[];

    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    @Type(() => CreateRoomTypeDto)
    @ValidateNested({ each: true })
    roomTypes: CreateRoomTypeDto[];

    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    @Type(() => CreateRoomDto)
    @ValidateNested({ each: true })
    rooms: CreateRoomDto[];
}
