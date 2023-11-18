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
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schemas';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';

@ApiTags('users')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/:id')
  @Public()
  @HttpCode(HttpStatus.OK)
  findOne(@Req() request): Promise<User> {
    return this.userService.findOne(request.params.id);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(request.params.id, updateUserDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Req() request): Promise<object> {
    const deletedUser = await this.userService.delete(request.params.id);

    if (!deletedUser) {
      return { message: 'User not found' };
    }
    return {
      message: 'User deleted successfully',
    };
  }

  @Public()
  @Post('forgot-password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto): Promise<object> {
    return this.userService.forgetPassword(forgetPasswordDto);
  }

  @Public()
  @Post('reset-password/:resetToken')
  async resetPassword(@Req() req, @Body() resetPasswordDto: ResetPasswordDto): Promise<object> {
    return this.userService.resetPassword(resetPasswordDto);
  }
}
