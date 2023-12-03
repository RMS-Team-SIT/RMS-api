import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schemas';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword, isPasswordMatch } from 'src/utils/password.utils';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { randomToken } from 'src/utils/random.utils';
import { MailService } from 'src/mail/mail.service';
import { ForgetPasswordDto } from './dto/forget-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailService: MailService,
  ) { }

  async findAll(): Promise<User[]> {
    return this.userModel
      .find()
      .select({
        password: 0,
        __v: 0,
        resetPasswordToken: 0,
        resetPasswordExpires: 0,
      })
      .exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel
      .findById(id)
      .select({
        password: 0,
        __v: 0,
        resetPasswordToken: 0,
        resetPasswordExpires: 0,
        emailVerificationToken: 0
      })
      .exec();
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
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdUser = new this.userModel({
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
      isEmailVerified: false,
      emailVerificationToken: randomToken(),
    });

    // send email verification
    const sendMailResult = await this.mailService.sendVerification({
      to: createdUser.email,
      token: createdUser.emailVerificationToken,
    });
    console.log(sendMailResult);
    return createdUser.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updateUser = this.userModel
      .findByIdAndUpdate(
        id,
        { ...updateUserDto, updated_at: Date.now() },
        { new: true },
      )
      .select({
        password: 0,
        __v: 0,
        resetPasswordToken: 0,
        resetPasswordExpires: 0,
        emailVerificationToken: 0,
      })
      .exec();
    return updateUser;
  }

  async updatePassword(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const isMatch = await isPasswordMatch(
      updateUserDto.oldPassword,
      user.password,
    );
    if (!isMatch) {
      throw new HttpException(
        'Old password is not correct',
        HttpStatus.BAD_REQUEST,
      );
    }
    const password = await hashPassword(updateUserDto.newPassword);
    const updateUser = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          password,
          updated_at: Date.now(),
        },
        { new: true },
      )
      .select({
        password: 0,
        __v: 0,
        resetPasswordToken: 0,
        resetPasswordExpires: 0,
        emailVerificationToken: 0,
      })
      .exec();
    return updateUser;
  }

  async delete(id: string): Promise<User> {
    const deleteUser = this.userModel.findByIdAndDelete(id).exec();
    return deleteUser;
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<object> {
    const user = await this.userModel
      .findOne({ email: forgetPasswordDto.email })
      .exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const resetPasswordToken = randomToken();

    // set reset password token and expires
    const updatedUser = await this.userModel
      .findByIdAndUpdate(user._id, {
        resetPasswordToken,
        resetPasswordExpires:
          Date.now() +
          (parseInt(process.env.RESET_PASSWORD_EXPIRES) || 3600000),
      })
      .exec();

    // send email
    const sendMailResult = await this.mailService.sendResetPassword({
      to: updatedUser.email,
      resetToken: resetPasswordToken,
    });
    return sendMailResult;
  }

  async resetPassword(
    token: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<object> {
    const user = await this.userModel
      .findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      })
      .exec();
    if (!user) {
      throw new HttpException('Reset token is invalid', HttpStatus.BAD_REQUEST);
    }
    const password = await hashPassword(resetPasswordDto.password);
    await this.userModel
      .findByIdAndUpdate(user._id, {
        password,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      })
      .exec();
    return {
      message: 'Password reset successfully',
    };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.userModel
      .findOne({
        emailVerificationToken: token,
      })
      .exec();
    if (!user) {
      throw new HttpException('Verify token is invalid', HttpStatus.BAD_REQUEST);
    }
    await this.userModel
      .findByIdAndUpdate(user._id, {
        isEmailVerified: true,
        emailVerificationToken: null,
      })
      .exec();
    return {
      message: 'Email verified successfully',
    };
  }
}
