import {
  Controller,
  Get,
  Post,
  HttpCode,
  Body,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ResidentService } from './resident.service';
import { Resident } from './schemas/resident.schema';
import { CreateResidentDto } from './dtos/create-resident.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';

@ApiTags('resident')
@Controller('api/resident')
@Public()
export class ResidentController {
  constructor(private readonly residentService: ResidentService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createResidentDto: CreateResidentDto) {
    console.log('createResidentDto', createResidentDto);
    
    return await this.residentService.create(createResidentDto);
  }

  @Get()
  async findAll(): Promise<Resident[]> {
    return await this.residentService.findAll();
  }

  @Get(':id')
  async findOne(@Req() req): Promise<Resident> {
    return await this.residentService.findOne(req.params.id);
  }
}
