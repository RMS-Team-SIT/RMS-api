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
    console.log('userId', userId);
    
    return await this.residentService.findMyResident(userId);
  }

  @Get()
  async findAll(): Promise<Resident[]> {
    return await this.residentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Resident> {
    return await this.residentService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateResidentDto: UpdateResidentDto,
  ): Promise<Resident> {
    return new Resident();
    // return await this.residentService.update(id, updateResidentDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Resident> {
    return new Resident();
    // return await this.residentService.delete(id);
  }
}