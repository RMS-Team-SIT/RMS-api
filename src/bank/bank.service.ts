import { InjectModel } from '@nestjs/mongoose';
import { Bank } from './schemas/bank.schema';
import { Model } from 'mongoose';
import { CreateBankDto } from './dtos/create-bank.dto';
import { validateObjectIdFormat } from 'src/utils/mongo.utils';

export class BankService {
  constructor(
    @InjectModel(Bank.name)
    private readonly bankModel: Model<Bank>,
  ) {}

  async create(createBankDto: CreateBankDto): Promise<Bank> {
    const createdBank = new this.bankModel(createBankDto);
    return createdBank.save();
  }

  async findAll(): Promise<Bank[]> {
    return this.bankModel.find().exec();
  }

  async findOne(bankId: string): Promise<Bank> {
    validateObjectIdFormat(bankId, 'Bank');

    return this.bankModel.findById(bankId).exec();
  }

  async update(id: string, createBankDto: CreateBankDto): Promise<Bank> {
    return await this.bankModel.findByIdAndUpdate(id, createBankDto, {
      new: true,
    });
  }

  async delete(id: string): Promise<Bank> {
    return await this.bankModel.findByIdAndRemove(id);
  }
}
