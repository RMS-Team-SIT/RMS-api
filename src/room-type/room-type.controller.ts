import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoomTypeService } from './room-type.service';

@Controller('room-type')
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
}
