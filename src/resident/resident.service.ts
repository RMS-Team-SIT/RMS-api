import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-resident.dto';
import { Resident } from './schemas/resident.schemas';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-resident.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Resident.name)
    private residentModel: Model<Resident>,
  ) {
    console.log('userModel', residentModel);
  }


}
