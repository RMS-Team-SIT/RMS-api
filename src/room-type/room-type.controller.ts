import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoomTypeService } from './room-type.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';

@Controller('/residence/:residenceId/room-type')
@ApiTags('Room Type')
@ApiBearerAuth()
export class RoomTypeController {
    constructor(
        private readonly roomTypeService: RoomTypeService
    ) { }

    @Get('/:roomTypeId')
    async getRoomType(@Req() req: any, @Param('roomTypeId') roomTypeId: string) {
        return this.roomTypeService.findOne(roomTypeId);
    }

    @Post()
    async createRoomType(
        @Req() req: any,
        @Param('residenceId') residenceId: string,
        @Body() createRoomTypeDto: CreateRoomTypeDto) {
        return this.roomTypeService.create(residenceId, createRoomTypeDto);
    }

    @Post('bulk')
    async createManyRoomTypes(
        @Req() req: any,
        @Param('residenceId') residenceId: string,
        @Body() createRoomTypeDtos: CreateRoomTypeDto[]) {
        return this.roomTypeService.createMany(residenceId, createRoomTypeDtos);
    }
}
