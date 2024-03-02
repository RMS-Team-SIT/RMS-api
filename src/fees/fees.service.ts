import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Fee } from './schemas/fee.schema';
import { Model } from 'mongoose';

@Injectable()
export class FeesService {
    constructor(
        @InjectModel(Fee.name)
        private readonly feeModel: Model<Fee>,
    ) { }

    async create(fee: Fee): Promise<Fee> {
        const createdFee = new this.feeModel(fee);
        return createdFee.save();
    }
}
