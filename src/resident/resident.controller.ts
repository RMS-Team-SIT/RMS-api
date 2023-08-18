import { Controller, Get, Req, Post, HttpCode, Body, Put, Delete } from '@nestjs/common';
import { UserService } from './resident.service';
import { CreateUserDto } from './dto/create-resident.dto';
import { User } from './schemas/resident.schemas';
import { UpdateUserDto } from './dto/update-resident.dto';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @HttpCode(200)
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Req() request): Promise<User> {
    return this.userService.findOne(request.params.id);
  }

  @Put(':id')
  @HttpCode(200)
  async update(@Req() request, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(request.params.id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(200)
  async delete(@Req() request): Promise<Object> {
    const deletedUser = await this.userService.delete(request.params.id);

    if (!deletedUser) {
      return { message: 'User not found' };
    }
    return {
      message: 'User deleted successfully',
    }
  }

}
