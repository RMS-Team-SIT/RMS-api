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
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schemas';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async findMe(@Req() req): Promise<User> {
    const userId = req.user.id;
    const user = await this.userService.findOne(userId);
    return user;
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Req() req): Promise<User> {
    return this.userService.findOne(req.params.id);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const isForbidden = req.user.id !== req.params.id;
    if (isForbidden) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    if (updateUserDto.oldPassword && updateUserDto.newPassword) {
      return this.userService.updatePassword(req.params.id, updateUserDto);
    } else {
      delete updateUserDto.oldPassword;
      delete updateUserDto.newPassword;
      return this.userService.update(req.params.id, updateUserDto);
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Req() req): Promise<{ message: string }> {
    const isForbidden = req.user.id !== req.params.id;
    if (isForbidden) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const deletedUser = await this.userService.delete(req.params.id);
    if (!deletedUser) {
      return { message: 'User not found' };
    }
    return {
      message: 'User deleted successfully',
    };
  }

  @Public()
  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  async forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<object> {
    return this.userService.forgetPassword(forgetPasswordDto);
  }

  @Public()
  @Post('reset-password/:resetToken')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Req() req,
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('resetToken') resetToken: string,
  ): Promise<object> {
    return this.userService.resetPassword(resetToken, resetPasswordDto);
  }

  @Public()
  @Post('verify-email/:token')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Param('token') token: string): Promise<object> {
    return this.userService.verifyEmail(token);
  }
}
