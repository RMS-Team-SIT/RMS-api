import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schemas';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from 'src/utils/password.utils';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { randomResetPasswordToken } from 'src/utils/random.utils';
import { MailService } from 'src/mail/mail.service';
import { ForgetPasswordDto } from './dto/forget-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailService: MailService,
  ) {
    console.log('userModel', userModel);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select({ password: 0, __v: 0 }).exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).select({ password: 0, __v: 0 }).exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const isDuplicateEmail = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (isDuplicateEmail) {
      const errors = { username: 'Email must be unique.' };
      throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel({
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
    });
    return createdUser.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updateUser = this.userModel
      .findByIdAndUpdate(
        id,
        { ...updateUserDto, updated_at: Date.now() },
        { new: false },
      )
      .exec();
    return updateUser;
  }

  async delete(id: string): Promise<User> {
    const deleteUser = this.userModel.findByIdAndDelete(id).exec();
    return deleteUser;
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<object> {
    const user = await this.userModel.findOne({ email: forgetPasswordDto.email }).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const resetPasswordToken = randomResetPasswordToken();

    // set reset password token and expires
    const updatedUser = await this.userModel.findByIdAndUpdate(user._id, {
      resetPasswordToken,
      resetPasswordExpires: Date.now() + (parseInt(process.env.RESET_PASSWORD_EXPIRES) || 3600000),
    }).exec();

    // send email
    this.mailService.sendResetPassword({
      to: updatedUser.email,
      resetToken: resetPasswordToken,
    });
    return {
      message: 'Email sent successfully',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<object> {
    const user = await this.userModel.findOne({ resetPasswordToken: resetPasswordDto.resetPasswordToken, resetPasswordExpires: { $gt: Date.now() } }).exec();
    if (!user) {
      throw new HttpException('Reset token is invalid', HttpStatus.BAD_REQUEST);
    }
    const password = await hashPassword(resetPasswordDto.newPassword);
    await this.userModel.findByIdAndUpdate(user._id, {
      password,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    }).exec();
    return {
      message: 'Password reset successfully',
    };

  }
}
