import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schemas';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from 'src/utils/password.utils';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
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

  // private async hashPassword(password: string): Promise<string> {
  //   const saltRound = parseInt(process.env.BCRYPT_SALT) || 5;
  //   return bcrypt.hash(password, saltRound);
  // }
}
