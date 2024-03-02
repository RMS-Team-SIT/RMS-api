import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Fee } from './schemas/fee.schema';
import { Model } from 'mongoose';
import { CreateFeeDto } from './dto/create-fee.dto';

@Injectable()
export class FeesService {
    constructor(
        @InjectModel(Fee.name)
        private readonly feeModel: Model<Fee>,
    ) { }

    async create(residenceId: string, createFeeDto: CreateFeeDto): Promise<Fee> {
        const createdFee = new this.feeModel({
            residence: residenceId,
            ...createFeeDto
        });
        return createdFee.save();
    }

    async createMany(residenceId: string, createFeeDtos: CreateFeeDto[]): Promise<Fee[]> {
        const createdFees = createFeeDtos.map(createFeeDto => {
            return new this.feeModel({
                residence: residenceId,
                ...createFeeDto
            });
        });
        return this.feeModel.insertMany(createdFees);
    }

}
