import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bill } from './schemas/bill.schema';
import { Model } from 'mongoose';
import { BillRoom } from './schemas/bill-room.schema';
import { CreateBillDto } from './dto/create-bill.dto';

@Injectable()
export class BillService {
  constructor(
    @InjectModel(Bill.name)
    private readonly billModel: Model<Bill>,
    @InjectModel(BillRoom.name)
    private readonly billRoomModel: Model<BillRoom>,
  ) { }

  async createBill(residenceId: string, createBillDto: CreateBillDto) {
  }
}
