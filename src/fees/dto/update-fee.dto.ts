import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFeeDto } from './create-fee.dto';
import { Exclude } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateFeeDto extends PartialType(CreateFeeDto) {
    @Exclude()
    _id?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    feename: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Min(0)
    feeprice: number;
}
