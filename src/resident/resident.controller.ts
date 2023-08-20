import {
  Controller,
  Get,
  Post,
  HttpCode,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { ResidentService } from './resident.service';
import { Resident } from './schemas/resident.schema';
import { CreateResidentDto } from './dtos/create-resident.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('resident')
@Controller('api/resident')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createResidentDto: CreateResidentDto) {
    return await this.residentService.create(createResidentDto);
  }

  @Get()
  async findAll(): Promise<Resident[]> {
    return await this.residentService.findAll();
  }
}
