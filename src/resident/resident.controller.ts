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
import { UserService } from './resident.service';
import { CreateUserDto } from './dto/create-resident.dto';
import { Resident } from './schemas/resident.schemas';
import { UpdateUserDto } from './dto/update-resident.dto';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) { }
  
}
