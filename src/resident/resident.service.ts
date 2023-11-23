import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resident } from './schemas/resident.schema';
import { CreateResidentDto } from './dtos/create-resident.dto';
import { UpdateResidentDto } from './dtos/update-resident.dto';

@Injectable()
export class ResidentService {
  constructor(
    @InjectModel(Resident.name)
    private readonly residentModel: Model<Resident>,
  ) {
  }

  async create(userId: string, createResidentDto: CreateResidentDto): Promise<Resident> {
    const createdResident = new this.residentModel({
      ...createResidentDto,
      owner: userId,
    });
    return createdResident.save();
  }

  async findMyResident(userId: string): Promise<Resident[]> {
    return this.residentModel
      .find({ owner: userId })
      .select({
        __v: 0, created_at: 0, updated_at: 0,
        "contact._id": 0,
        "contact.created_at": 0,
        "contact.updated_at": 0,
      })
      .exec();
  }

  async findAll(): Promise<Resident[]> {
    return this.residentModel
      .find()
      .select({
        __v: 0, created_at: 0, updated_at: 0,
        "contact._id": 0,
        "contact.created_at": 0,
        "contact.updated_at": 0,
      })
      .exec();
  }

  async findOne(id: string): Promise<Resident> {
    return this.residentModel
      .findById(id)
      .select({
        __v: 0, created_at: 0, updated_at: 0,
        "contact._id": 0,
        "contact.created_at": 0,
        "contact.updated_at": 0,
      }).exec();
  }

  async update(id: string, dto: UpdateResidentDto): Promise<Resident> {
    return this.residentModel
      .findByIdAndUpdate(id,
        {
          ...dto,
          updated_at: Date.now()
        }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Resident> {
    return this.residentModel.findByIdAndDelete(id).exec();
  }

  // private hideFields(fields: string[]): object {
  //   return fields.map(field => ({ [field]: 0 }));
  // }
}
