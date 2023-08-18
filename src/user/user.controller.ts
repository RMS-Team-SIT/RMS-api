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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schemas';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Req() request): Promise<User> {
    return this.userService.findOne(request.params.id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(request.params.id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Req() request): Promise<Object> {
    const deletedUser = await this.userService.delete(request.params.id);

    if (!deletedUser) {
      return { message: 'User not found' };
    }
    return {
      message: 'User deleted successfully',
    };
  }
}
