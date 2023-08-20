import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resident } from './schemas/resident.schema';
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
    const createdResident = new this.residentModel({
      ...createResidentDto,
    });
    return createdResident.save();
  }

  async findAll(): Promise<Resident[]> {
    return this.residentModel.find().exec();
  }

  async findOne(id: string): Promise<Resident> {
    return this.residentModel.findById(id).exec();
  }
}
