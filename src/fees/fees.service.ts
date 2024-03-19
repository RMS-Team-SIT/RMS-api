import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Fee } from './schemas/fee.schema';
import { Model } from 'mongoose';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { ResidenceService } from 'src/residence/residence.service';

@Injectable()
export class FeesService {
  constructor(
    @InjectModel(Fee.name)
    private readonly feeModel: Model<Fee>,
    private readonly residenceService: ResidenceService,
  ) { }

  async create(residenceId: string, createFeeDto: CreateFeeDto): Promise<Fee> {
    const createdFee = new this.feeModel({
      residence: residenceId,
      ...createFeeDto,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return createdFee.save();
  }

  async createMany(
    residenceId: string,
    createFeeDtos: CreateFeeDto[],
  ): Promise<Fee[]> {
    const createdFees = createFeeDtos.map((createFeeDto) => {
      return new this.feeModel({
        residence: residenceId,
        ...createFeeDto,
        created_at: new Date(),
        updated_at: new Date(),
      });
    });

    // Add Fee to Residence
    await this.residenceService.addFeesToResidence(
      residenceId,
      createdFees.map((fee) => fee._id),
    );

    return this.feeModel.insertMany(createdFees);
  }

  async findAll(residenceId: string): Promise<Fee[]> {
    return this.feeModel.find({ residence: residenceId }).exec();
  }

  async findOne(residenceId: string, id: string): Promise<Fee> {
    return this.feeModel.findOne({
      residence: residenceId,
      _id: id
    }).exec();
  }

  async update(residenceId: string, id: string, updateFeeDto: UpdateFeeDto): Promise<Fee> {
    return this.feeModel.findOneAndUpdate(
      {
        residence: residenceId,
        _id: id
      },
      {
        ...updateFeeDto,
        updated_at: new Date(),
      },
      { new: true },
    );
  }
}
