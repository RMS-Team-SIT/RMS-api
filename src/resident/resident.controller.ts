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
import { ResidentService } from './resident.service';
import { Resident } from './schemas/resident.schema';
import { CreateResidentDto } from './dtos/create-resident.dto';
import { UpdateResidentDto } from './dtos/update-resident.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Rental } from './schemas/rental.schema';
import { CreateRentalDto } from './dtos/create-rental.dto';
import { UpdateRentalDto } from './dtos/update-rental.dto';
import { Room } from './schemas/room.schema';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';

@ApiTags('resident')
@ApiBearerAuth()
@Controller('resident')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createResidentDto: CreateResidentDto,
    @Req() req,
  ): Promise<Resident> {
    const userId = req.user.id;
    return await this.residentService.create(userId, createResidentDto);
  }

  @Get('/my')
  async findMyResident(@Req() req): Promise<Resident[]> {
    const userId = req.user.id;
    try {
      return await this.residentService.findMyResident(userId);
    } catch (err) {
      console.log(err);
      throw new NotFoundException('Resident not found');
    }
  }

  // @Get()
  // async findAll(): Promise<Resident[]> {
  //   return await this.residentService.findAll();
  // }

  @Get(':residentId')
  async findOne(@Param('residentId') id: string): Promise<Resident> {
    try {
      return await this.residentService.findOne(id);
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Resident not found');
    }
  }

  @Put(':residentId')
  async update(
    @Req() req,
    @Param('residentId') id: string,
    @Body() updateResidentDto: UpdateResidentDto,
  ): Promise<Resident> {
    const userId = req.user.id;
    const resident = await this.residentService.findOne(id);

    await this.checkResidentOwnership(userId, resident);

    if (resident.owner._id.toString() !== userId.toString()) {
      throw new ForbiddenException();
    }
    return await this.residentService.update(id, updateResidentDto);
  }

  @Delete(':residentId')
  async delete(@Req() req, @Param('id') id: string): Promise<Resident> {
    const userId = req.user.id;
    const resident = await this.residentService.findOne(id);

    await this.checkResidentOwnership(userId, resident);

    return await this.residentService.delete(id);
  }

  private async checkResidentOwnership(userId: string, resident: Resident) {
    if (!resident || resident.owner._id.toString() !== userId.toString()) {
      throw new ForbiddenException();
    }
  }

  @Post(':residentId/rental')
  async createRental(
    @Req() req,
    @Param('residentId') residentId: string,
    @Body() dto: CreateRentalDto,
  ): Promise<Rental> {
    const userId = req.user.id;

    // check permission req.user is onwer of resident or not ?
    const resident = await this.residentService.findOne(residentId);
    if (resident.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this resident');
    }

    return await this.residentService.createRental(residentId, dto);
  }

  @Get(':residentId/rental')
  async findAllRentalInResident(
    @Req() req,
    @Param('residentId') residentId: string,
  ): Promise<Rental[]> {
    const userId = req.user.id;

    // check permission req.user is onwer of resident or not ?
    const resident = await this.residentService.findOne(residentId);
    if (resident.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this resident');
    }
    return await this.residentService.findAllRentalInResident(residentId);
  }

  @Get(':residentId/rental/:rentalId')
  async findOneRentalInResident(
    @Req() req,
    @Param('residentId') residentId: string,
    @Param('rentalId') rentalId: string,
  ): Promise<Rental> {
    const userId = req.user.id;

    // check permission req.user is onwer of resident or not ?
    const resident = await this.residentService.findOne(residentId);
    if (resident.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this resident');
    }

    return await this.residentService.findOneRental(rentalId);
  }

  @Put(':residentId/rental/:rentalId')
  async updateRentalInResident(
    @Req() req,
    @Param('residentId') residentId: string,
    @Param('rentalId') rentalId: string,
    @Body() updateRentalDto: UpdateRentalDto,
  ): Promise<Rental> {
    const userId = req.user.id;

    // check permission req.user is onwer of resident or not ?
    const resident = await this.residentService.findOne(residentId);
    if (resident.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this resident');
    }

    return await this.residentService.updateRental(residentId, rentalId, updateRentalDto);
  }

  @Delete(':residentId/rental/:rentalId')
  async deleteRentalInResident(
    @Req() req,
    @Param('residentId') residentId: string,
    @Param('rentalId') rentalId: string,
  ): Promise<Rental> {
    const userId = req.user.id;

    // check permission req.user is onwer of resident or not ?
    const resident = await this.residentService.findOne(residentId);
    if (resident.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this resident');
    }

    return await this.residentService.deleteRental(rentalId);
  }

  @Post(':residentId/room')
  async createRoom(
    @Req() req,
    @Body() dto: CreateRoomDto,
    @Param('residentId') residentId: string,
  ): Promise<Room> {
    const userId = req.user.id;

    // check permission req.user is onwer of resident or not ?
    const resident = await this.residentService.findOne(residentId);
    if (resident.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this resident');
    }

    return await this.residentService.createRoom(residentId, dto);
  }

  @Get(':residentId/room')
  async findAllRoomInResident(
    @Req() req,
    @Param('residentId') residentId: string,
  ): Promise<Room[]> {
    const userId = req.user.id;

    // check permission req.user is onwer of resident or not ?
    const resident = await this.residentService.findOne(residentId);
    if (resident.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this resident');
    }
    return await this.residentService.findAllRoomInResident(residentId);
  }

  @Get(':residentId/room/:roomId')
  async findOneRoomInResident(
    @Req() req,
    @Param('residentId') residentId: string,
    @Param('roomId') roomId: string,
  ): Promise<Room> {
    const userId = req.user.id;

    // check permission req.user is onwer of resident or not ?
    const resident = await this.residentService.findOne(residentId);
    if (resident.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this resident');
    }

    return await this.residentService.findOneRoom(roomId);
  }

  @Put(':residentId/room/:roomId')
  async updateRoomInResident(
    @Req() req,
    @Param('residentId') residentId: string,
    @Param('roomId') roomId: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<Room> {
    const userId = req.user.id;

    // check permission req.user is onwer of resident or not ?
    const resident = await this.residentService.findOne(residentId);
    if (resident.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this resident');
    }

    return await this.residentService.updateRoom(
      residentId,
      roomId,
      updateRoomDto,
    );
  }

  @Delete(':residentId/room/:roomId')
  async deleteRoomInResident(
    @Req() req,
    @Param('residentId') residentId: string,
    @Param('roomId') roomId: string,
  ): Promise<Room> {
    const userId = req.user.id;

    // check permission req.user is onwer of resident or not ?
    const resident = await this.residentService.findOne(residentId);
    if (resident.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this resident');
    }

    return await this.residentService.deleteRoomInResident(residentId, roomId);
  }
}
