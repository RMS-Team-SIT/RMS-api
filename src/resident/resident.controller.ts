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
  Res,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ResidentService } from './resident.service';
import { Resident } from './schemas/resident.schema';
import { CreateResidentDto } from './dtos/create-resident.dto';
import { UpdateResidentDto } from './dtos/update-resident.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';
import { Rental } from './schemas/rental.schema';
import { CreateRentalDto } from './dtos/create-rental.dto';

@ApiTags('resident')
@Controller('resident')
export class ResidentController {
  constructor(
    private readonly residentService: ResidentService,
  ) { }

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

  @Get()
  async findAll(): Promise<Resident[]> {
    return await this.residentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Resident> {
    try {
      return await this.residentService.findOne(id);
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Resident not found');
    }
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
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

  @Delete(':id')
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

  @Post(":id/rental")
  async createRental(
    @Req() req,
    @Param("id") residentId: string,
    @Body() dto: CreateRentalDto,
  ): Promise<Resident> {
    const userId = req.user.id;

    // check permission req.user is onwer of resident or not ?
    const resident = await this.residentService.findOne(residentId);
    if (resident.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException("You are not owner of this resident");
    }

    return await this.residentService.createRental(residentId, dto);
  }

  @Get(":id/rental")
  async findAllRentalInResident(
    @Req() req,
    @Param("id") residentId: string,
  ): Promise<Rental[]> {
    const userId = req.user.id;

    // check permission req.user is onwer of resident or not ?
    const resident = await this.residentService.findOne(residentId);
    if (resident.owner._id.toString() != userId.toString()) {
      throw new UnauthorizedException("You are not owner of this resident");
    }
    return await this.residentService.findAllRentalInResident(residentId);
  }

}
