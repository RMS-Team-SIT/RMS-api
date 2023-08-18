import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resident } from './schemas/resident.schemas';
import * as bcrypt from 'bcrypt';
import { CreateResidentDto } from './dtos/create-resident.dto';

@Injectable()
export class ResidentService {
  constructor(
    @InjectModel(Resident.name)
    private residentModel: Model<Resident>,
  ) {
    console.log('userModel', residentModel);
  }

  async create(createResidentDto: CreateResidentDto): Promise<Resident> {
    return await this.residentModel.create(createResidentDto);
  }
}
