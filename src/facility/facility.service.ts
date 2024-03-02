import { Injectable } from '@nestjs/common';
import { Facility } from './schemas/facility.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { validateObjectIdFormat } from 'src/utils/mongo.utils';

@Injectable()
export class FacilityService {
  constructor(
    @InjectModel(Facility.name)
    private readonly facilityModel: Model<Facility>,
  ) {}

  async create(dto: CreateFacilityDto): Promise<Facility> {
    const createdFacility = new this.facilityModel(dto);
    return createdFacility.save();
  }

  async findAll(): Promise<Facility[]> {
    return this.facilityModel.find().exec();
  }

  async findOne(id: string): Promise<Facility> {
    validateObjectIdFormat(id, 'Bank');

    return this.facilityModel.findById(id).exec();
  }

  async update(id: string, dto: CreateFacilityDto): Promise<Facility> {
    return await this.facilityModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
  }

  async delete(id: string): Promise<Facility> {
    return await this.facilityModel.findByIdAndRemove(id);
  }
}
