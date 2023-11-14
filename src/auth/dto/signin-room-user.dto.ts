import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInRoomUserDto {
    @ApiProperty()
    @IsNotEmpty()
    residentId: string;

    @ApiProperty()
    @IsNotEmpty()
    roomId: string;

    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}
