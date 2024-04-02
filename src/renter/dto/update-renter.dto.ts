import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRenterDto } from './create-renter.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRenterDto extends PartialType(CreateRenterDto) {
    // Password is optional
    @IsString()
    @IsOptional()
    @ApiProperty()
    password?: string;
}
