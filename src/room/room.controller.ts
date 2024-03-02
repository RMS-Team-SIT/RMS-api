import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './schemas/room.schema';
import { ResidenceService } from 'src/residence/residence.service';
import { RoomService } from './room.service';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateManyRoomDto } from './dto/create-many-room.dto';

@Controller('/residence/:residenceId/room')
@ApiTags('Room')
@ApiBearerAuth()
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly residenceService: ResidenceService,
  ) {}

  @Post('')
  async createRoom(
    @Req() req,
    @Param('residenceId') residenceId: string,
    @Body() dto: CreateRoomDto,
  ): Promise<Room> {
    const userId = req.user.id;

    await this.residenceService.checkOwnerPermission(userId, residenceId);

    return await this.roomService.createRoom(residenceId, dto);
  }

  @Post('/many')
  async createManyRoom(
    @Req() req,
    @Param('residenceId') residenceId: string,
    @Body() dto: CreateManyRoomDto,
  ): Promise<Room> {
    const userId = req.user.id;

    await this.residenceService.checkOwnerPermission(userId, residenceId);

    return await this.roomService.createManyRoomWizard(residenceId, dto);
  }

  @Get('')
  async findAllRoomInResidence(
    @Req() req,
    @Param('residenceId') residenceId: string,
  ): Promise<Room[]> {
    const userId = req.user.id;

    await this.residenceService.checkOwnerPermission(userId, residenceId);

    return await this.roomService.findAllRoomInResidence(residenceId);
  }

  @Get('/:roomId')
  async findOneRoomInResidence(
    @Req() req,
    @Param('residenceId') residenceId: string,
    @Param('roomId') roomId: string,
  ): Promise<Room> {
    const userId = req.user.id;

    await this.residenceService.checkOwnerPermission(userId, residenceId);

    return await this.roomService.findOneRoom(residenceId, roomId);
  }

  @Put('/:roomId')
  async updateRoomInResidence(
    @Req() req,
    @Param('residenceId') residenceId: string,
    @Param('roomId') roomId: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<Room> {
    const userId = req.user.id;

    await this.residenceService.checkOwnerPermission(userId, residenceId);

    return await this.roomService.updateRoom(
      residenceId,
      roomId,
      updateRoomDto,
    );
  }

  @Delete('/:roomId')
  async deleteRoomInResidence(
    @Req() req,
    @Param('residenceId') residenceId: string,
    @Param('roomId') roomId: string,
  ): Promise<Room> {
    const userId = req.user.id;

    await this.residenceService.checkOwnerPermission(userId, residenceId);

    return await this.roomService.deleteRoom(residenceId, roomId);
  }
}
