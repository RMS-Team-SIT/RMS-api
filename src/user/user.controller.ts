import { Controller, Get, Req, Post, HttpCode, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return 'This action adds a new cat';
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Req() request): string {
    return `This action returns a #${request.params.id}`;
  }
}
