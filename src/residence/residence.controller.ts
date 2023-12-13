import {
  Controller,
  Get,
  Post,
  HttpCode,
  Body,
  HttpStatus,
  Req,
  Put,
  Delete,
  Param,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ResidenceService } from './residence.service';
import { Residence } from './schemas/residence.schema';
import { CreateResidenceDto } from './dtos/create-residence.dto';
import { UpdateResidenceDto } from './dtos/update-residence.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Renter } from './schemas/renter.schema';
import { CreateRenterDto } from './dtos/create-renter.dto';
import { UpdateRenterDto } from './dtos/update-renter.dto';
import { Room } from './schemas/room.schema';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';

@ApiTags('residence')
@ApiBearerAuth()
@Controller('residence')
export class ResidenceController {
  constructor(private readonly residenceService: ResidenceService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createResidenceDto: CreateResidenceDto,
    @Req() req,
  ): Promise<Residence> {
    const userId = req.user.id;
    return await this.residenceService.create(userId, createResidenceDto);
  }

  @Get('/my')
  async findMyResidence(@Req() req): Promise<Residence[]> {
    const userId = req.user.id;
    try {
      return await this.residenceService.findMyResidence(userId);
    } catch (err) {
      console.log(err);
      throw new NotFoundException('Residence not found');
    }
  }

  @Get(':residenceId')
  async findOne(@Param('residenceId') id: string): Promise<Residence> {
    try {
      return await this.residenceService.findOne(id);
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Residence not found');
    }
  }

  @Put(':residenceId')
  async update(
    @Req() req,
    @Param('residenceId') id: string,
    @Body() updateResidenceDto: UpdateResidenceDto,
  ): Promise<Residence> {
    const userId = req.user.id;
    const residence = await this.residenceService.findOne(id);

    await this.checkResidenceOwnership(userId, residence);

    if (residence.owner._id.toString() !== userId.toString()) {
      throw new ForbiddenException();
    }
    return await this.residenceService.update(id, updateResidenceDto);
  }

  @Delete(':residenceId')
  async delete(@Req() req, @Param('id') id: string): Promise<Residence> {
    const userId = req.user.id;
    const residence = await this.residenceService.findOne(id);

    await this.checkResidenceOwnership(userId, residence);

    return await this.residenceService.delete(id);
  }

  private async checkResidenceOwnership(userId: string, residence: Residence) {
    if (!residence || residence.owner._id.toString() !== userId.toString()) {
      throw new ForbiddenException();
    }
  }

  @Post(':residenceId/renter')
  async createRenter(
    @Req() req,
    @Param('residenceId') residenceId: string,
    @Body() dto: CreateRenterDto,
  ): Promise<Renter> {
    const userId = req.user.id;

    // check permission req.user is onwer of residence or not ?
    const residence = await this.residenceService.findOne(residenceId);
    if (residence.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this residence');
    }

    return await this.residenceService.createRenter(residenceId, dto);
  }

  @Get(':residenceId/renter')
  async findAllRenterInResidence(
    @Req() req,
    @Param('residenceId') residenceId: string,
  ): Promise<Renter[]> {
    const userId = req.user.id;

    // check permission req.user is onwer of residence or not ?
    const residence = await this.residenceService.findOne(residenceId);
    if (residence.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this residence');
    }
    return await this.residenceService.findAllRenterInResidence(residenceId);
  }

  @Get(':residenceId/renter/:renterId')
  async findOneRenterInResidence(
    @Req() req,
    @Param('residenceId') residenceId: string,
    @Param('renterId') renterId: string,
  ): Promise<Renter> {
    const userId = req.user.id;

    // check permission req.user is onwer of residence or not ?
    const residence = await this.residenceService.findOne(residenceId);
    if (residence.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this residence');
    }

    return await this.residenceService.findOneRenter(renterId);
  }

  @Put(':residenceId/renter/:renterId')
  async updateRenterInResidence(
    @Req() req,
    @Param('residenceId') residenceId: string,
    @Param('renterId') renterId: string,
    @Body() updateRenterDto: UpdateRenterDto,
  ): Promise<Renter> {
    const userId = req.user.id;

    // check permission req.user is onwer of residence or not ?
    const residence = await this.residenceService.findOne(residenceId);
    if (residence.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this residence');
    }

    return await this.residenceService.updateRenter(residenceId, renterId, updateRenterDto);
  }

  @Put(':residenceId/renter/:renterId/reactive')
  async reactiveRenter(
    @Req() req,
    @Param('residenceId') residenceId: string,
    @Param('renterId') renterId: string,
  ): Promise<Renter> {
    const userId = req.user.id;

    // check permission req.user is onwer of residence or not ?
    const residence = await this.residenceService.findOne(residenceId);
    if (residence.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this residence');
    }

    return await this.residenceService.reactiveRenter(renterId);
  }

  @Delete(':residenceId/renter/:renterId')
  async deleteRenterInResidence(
    @Req() req,
    @Param('residenceId') residenceId: string,
    @Param('renterId') renterId: string,
  ): Promise<Renter> {
    const userId = req.user.id;

    // check permission req.user is onwer of residence or not ?
    const residence = await this.residenceService.findOne(residenceId);
    if (residence.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this residence');
    }

    return await this.residenceService.deleteRenter(renterId, "soft");
  }

  @Post(':residenceId/room')
  async createRoom(
    @Req() req,
    @Body() dto: CreateRoomDto,
    @Param('residenceId') residenceId: string,
  ): Promise<Room> {
    const userId = req.user.id;

    // check permission req.user is onwer of residence or not ?
    const residence = await this.residenceService.findOne(residenceId);
    if (residence.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this residence');
    }

    return await this.residenceService.createRoom(residenceId, dto);
  }

  @Get(':residenceId/room')
  async findAllRoomInResidence(
    @Req() req,
    @Param('residenceId') residenceId: string,
  ): Promise<Room[]> {
    const userId = req.user.id;

    // check permission req.user is onwer of residence or not ?
    const residence = await this.residenceService.findOne(residenceId);
    if (residence.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this residence');
    }
    return await this.residenceService.findAllRoomInResidence(residenceId);
  }

  @Get(':residenceId/room/:roomId')
  async findOneRoomInResidence(
    @Req() req,
    @Param('residenceId') residenceId: string,
    @Param('roomId') roomId: string,
  ): Promise<Room> {
    const userId = req.user.id;

    // check permission req.user is onwer of residence or not ?
    const residence = await this.residenceService.findOne(residenceId);
    if (residence.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this residence');
    }

    return await this.residenceService.findOneRoom(roomId);
  }

  @Put(':residenceId/room/:roomId')
  async updateRoomInResidence(
    @Req() req,
    @Param('residenceId') residenceId: string,
    @Param('roomId') roomId: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<Room> {
    const userId = req.user.id;

    // check permission req.user is onwer of residence or not ?
    const residence = await this.residenceService.findOne(residenceId);
    if (residence.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this residence');
    }

    return await this.residenceService.updateRoom(
      residenceId,
      roomId,
      updateRoomDto,
    );
  }

  @Delete(':residenceId/room/:roomId')
  async deleteRoomInResidence(
    @Req() req,
    @Param('residenceId') residenceId: string,
    @Param('roomId') roomId: string,
  ): Promise<Room> {
    const userId = req.user.id;

    // check permission req.user is onwer of residence or not ?
    const residence = await this.residenceService.findOne(residenceId);
    if (residence.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this residence');
    }

    return await this.residenceService.deleteRoom(residenceId, roomId);
  }
}
