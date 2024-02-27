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
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UserRole } from '../auth/enum/user-role.enum';
import { validateObjectIdFormat } from 'src/utils/mongo.utils';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailService: MailService,
    private readonly notificationService: NotificationService,
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
        emailVerificationToken: 0,
      })
      .exec();
  }

  async findAdmin(): Promise<User[]> {
    return this.userModel
      .find({ role: UserRole.ADMIN })
      .exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(createUserDto: CreateUserDto, isNewAdmin = false): Promise<User> {
    await this.validateUniqueField('email', createUserDto.email, 'Email must be unique.');
    await this.validateUniqueField('phone', createUserDto.phone, 'Phone must be unique.');

    const user = {
      ...createUserDto,
      role: [isNewAdmin ? UserRole.ADMIN : UserRole.LANDLORD],
      password: await hashPassword(createUserDto.password),
      isEmailVerified: isNewAdmin ? true : false,
      emailVerificationToken: isNewAdmin ? null : randomToken(),
      isApprovedKYC: isNewAdmin ? true : false,
    }

    const createdUser = new this.userModel(user);

    // send email verification for non-admin
    if (!isNewAdmin) {
      await this.sendEmailVerification(createdUser);
    }

    // send notification to user
    const userNotification = {
      to: createdUser._id,
      title: 'You have registered successfully!',
      content: `You have registered with email: ${user.email} successfully. Please verify your email to activate your account.`,
      isSentEmail: true,
      isRead: false
    };
    await this.notificationService.create(userNotification);

    // send notification to admin
    const admins = await this.findAdmin();
    const adminNotifications = admins.map(admin => ({
      to: admin._id,
      title: 'New user registered',
      content: `New user registered with email: ${createUserDto.email}. Please review and approve KYC of this user.`,
      isSentEmail: true,
      isRead: false
    }));
    await this.notificationService.createMany(adminNotifications);

    return createdUser.save();
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    // if email verified, email can not be changed
    if (user.isEmailVerified) {
      console.log('email verified can not be changed');
      delete updateUserDto.email;
    } else {
      if (updateUserDto.email) {
        // TODO: check email is duplicate
        const duplicateEmail = await this.userModel
          .findOne({ email: updateUserDto.email, _id: { $ne: userId } })
          .exec();
        if (duplicateEmail) {
          throw new HttpException('Email is duplicate', HttpStatus.BAD_REQUEST);
        }

        // send email verification if email changed and isEmailVerified is false
        const shouldSendEmailVerification = await this.userModel.findOne({
          _id: userId,
          email: { $ne: updateUserDto.email },
          isEmailVerified: false,
        });
        if (shouldSendEmailVerification) {
          console.log('send email verification to ', updateUserDto.email);
          const sendMailResult = await this.mailService.sendVerification({
            to: updateUserDto.email,
            token: user.emailVerificationToken,
          });
          console.log(sendMailResult);
        }
      }
    }

    if (updateUserDto.phone) {
      const duplicatePhone = await this.userModel
        .findOne({ phone: updateUserDto.phone, _id: { $ne: userId } })
        .exec();

      if (duplicatePhone) {
        throw new HttpException('Phone is duplicate', HttpStatus.BAD_REQUEST);
      }
    }

    const updateUser = this.userModel
      .findByIdAndUpdate(
        userId,
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
    updateUserPasswordDto: UpdateUserPasswordDto,
  ): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const isMatch = await isPasswordMatch(
      updateUserPasswordDto.oldPassword,
      user.password,
    );
    if (!isMatch) {
      throw new HttpException(
        'Old password is not correct',
        HttpStatus.BAD_REQUEST,
      );
    }
    const password = await hashPassword(updateUserPasswordDto.newPassword);
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

  async checkValidResetPasswordToken(
    token: string,
  ): Promise<{ message: string }> {
    const user = await this.userModel
      .findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      })
      .exec();
    if (!user) {
      throw new HttpException('Reset token is invalid', HttpStatus.BAD_REQUEST);
    }
    return {
      message: 'Reset token is valid',
    };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.userModel
      .findOne({
        emailVerificationToken: token,
      })
      .exec();
    if (!user) {
      throw new HttpException(
        'Verify token is invalid',
        HttpStatus.BAD_REQUEST,
      );
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

  private async validateUniqueField(field: string, value: string, errorMessage: string): Promise<void> {
    const isDuplicate = await this.userModel.findOne({ [field]: value });
    if (isDuplicate) {
      const errors = { [field]: errorMessage };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async sendEmailVerification(user: User): Promise<void> {
    await this.mailService.sendVerification({
      to: user.email,
      token: user.emailVerificationToken,
    });
  }

  // Admin only
  async changeApproveKYCStatus(userId: string, kycStatus: boolean): Promise<User> {
    validateObjectIdFormat(userId, 'User ID');
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          isApprovedKYC: kycStatus,
          updated_at: Date.now()
        },
        { new: true },
      )
      .select({
        password: 0,
        resetPasswordToken: 0,
        resetPasswordExpires: 0,
        emailVerificationToken: 0,
      })
      .exec();
    return updatedUser;
  }
}
