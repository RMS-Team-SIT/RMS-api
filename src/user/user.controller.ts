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
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schemas';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { RolesGuard } from '../auth/guard/user-role.guard';
import { UserRole } from '../auth/enum/user-role.enum';
import { Roles } from '../auth/decorator/user-role.decorator';
import { UploadIdCardDto } from './dto/upload-idcard.dto';
import { ResponseUserOverallStatsDto } from './dto/response-user-overallstats.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Post('/create-admin')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto, true);
  }

  @Post('/signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/overall-stats')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN)
  async getOverallStats(): Promise<ResponseUserOverallStatsDto> {
    return this.userService.overallStats();
  }

  @Get('/pending-kyc')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN)
  async getPendingKYC(): Promise<User[]> {
    return this.userService.findPendingKYC();
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async findMe(@Req() req): Promise<any> {
    const role = req.user.roles;

    if (role === UserRole.RENTER) {
      const renter = JSON.parse(JSON.stringify(req.user.renter));
      return { role: [UserRole.RENTER], ...renter };
    } else {
      const userId = req.user.id;
      const user = await this.userService.findOne(userId);
      if (!user)
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      return user;
    }
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
    return this.userService.update(req.params.id, updateUserDto);
  }

  @Put('/:id/update-password')
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Req() req,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ): Promise<User> {
    const isForbidden = req.user.id !== req.params.id;
    if (isForbidden) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return this.userService.updatePassword(
      req.params.id,
      updateUserPasswordDto,
    );
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
  @Get('reset-password/:resetToken')
  @HttpCode(HttpStatus.OK)
  async checkValidResetPasswordToken(
    @Req() req,
    @Param('resetToken') resetToken: string,
  ): Promise<object> {
    return this.userService.checkValidResetPasswordToken(resetToken);
  }

  @Public()
  @Post('verify-email/:token')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Param('token') token: string): Promise<object> {
    return this.userService.verifyEmail(token);
  }

  @Get('resend-verify-email/:userId')
  @HttpCode(HttpStatus.OK)
  async resendVerifyEmail(
    @Req() req,
    @Param('userId') userId: string,
  ): Promise<object> {
    console.log(userId);
    return this.userService.resendVerifyEmail(userId);
  }

  @Get('accept-policy/:userId')
  @HttpCode(HttpStatus.OK)
  async acceptPolicy(
    @Req() req,
    @Param('userId') userId: string,
  ): Promise<object> {
    console.log(userId);
    return this.userService.acceptPolicy(userId);
  }

  @Post('/:userId/upload-id-card')
  @HttpCode(HttpStatus.OK)
  async uploadIdCardNumber(
    @Req() req,
    @Param('userId') userId: string,
    @Body() uploadIdCardDto: UploadIdCardDto,
  ): Promise<object> {
    return this.userService.uploadIdCardNumber(userId, uploadIdCardDto);
  }

  @Roles(UserRole.ADMIN)
  @Get('approve-kyc/:userId')
  @HttpCode(HttpStatus.OK)
  async approveKYC(
    @Req() req,
    @Param('userId') userId: string,
  ): Promise<object> {
    return this.userService.approveKYCStatus(userId);
  }
}
