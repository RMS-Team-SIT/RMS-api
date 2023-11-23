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
} from '@nestjs/common';
import { ResidentService } from './resident.service';
import { Resident } from './schemas/resident.schema';
import { CreateResidentDto } from './dtos/create-resident.dto';
import { UpdateResidentDto } from './dtos/update-resident.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';

@ApiTags('resident')
@Controller('resident')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createResidentDto: CreateResidentDto, @Req() req) {
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
    if (!resident) {
      throw new NotFoundException('Resident not found');
    }
    if (resident.owner._id !== userId) {
      throw new ForbiddenException();
    }
    return await this.residentService.update(id, updateResidentDto);
  }

  @Delete(':id')
  async delete(@Req() req, @Param('id') id: string): Promise<Resident> {
    const userId = req.user.id;
    const resident = await this.residentService.findOne(id);
    if (!resident) {
      throw new NotFoundException('Resident not found');
    }
    if (resident.owner._id !== userId) {
      throw new ForbiddenException();
    }
    return await this.residentService.delete(id);
  }
}