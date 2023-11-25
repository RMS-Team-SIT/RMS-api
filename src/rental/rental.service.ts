import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rental } from './schemas/rental.schema';
import { CreateRentalDto } from './dtos/create-rental.dto';

@Injectable()
export class RentalService {
  constructor(
    @InjectModel(Rental.name)
    private rentalModel: Model<Rental>,
  ) {}

  async findAll(): Promise<Rental[]> {
    return this.rentalModel.find().exec();
  }

  async findOne(id: string): Promise<Rental> {
    return this.rentalModel.findById(id).exec();
  }

  async create(dto: CreateRentalDto): Promise<Rental> {
    const createdRental = new this.rentalModel({ ...dto });
    return createdRental.save();
  }
}
