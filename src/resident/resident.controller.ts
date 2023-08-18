import {
  Controller,
  Get,
  Req,
  Post,
  HttpCode,
  Body,
  Put,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ResidentService } from './resident.service';
import { Resident } from './schemas/resident.schemas';
@Controller('api/resident')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) { }

}
