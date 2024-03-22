import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bill } from './schemas/bill.schema';
import { Model } from 'mongoose';
import { BillRoom } from './schemas/bill-room.schema';
import { CreateBillDto } from './dto/create-bill.dto';
import { RoomService } from 'src/room/room.service';
import { MeterRecordService } from 'src/meter-record/meter-record.service';
import { MeterRecord } from 'src/meter-record/schemas/meter-record.schema';
import { ResidenceService } from 'src/residence/residence.service';
import { UpdateBillDto } from './dto/update-bill.dto';
import { UpdateBillRoomDto } from './dto/update-bill-room.dto';

@Injectable()
export class BillService {
  constructor(
    @InjectModel(Bill.name)
    private readonly billModel: Model<Bill>,
    @InjectModel(BillRoom.name)
    private readonly billRoomModel: Model<BillRoom>,
    private readonly roomService: RoomService,
    private readonly meterRecordService: MeterRecordService,
    private readonly residenceService: ResidenceService,
  ) { }

  private generateBillNumber = (length = 8) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let billNumber = '';
    for (let i = 0; i < length; i++) {
      billNumber += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return billNumber;
  }

  async createBill(residenceId: string, createBillDto: CreateBillDto) {
    const residence = await this.residenceService.findOne(residenceId);

    // Find meterRecord
    const meterRecord =
      await this.meterRecordService.getMeterRecordByIdAndResidenceId(
        createBillDto.meterRecord,
        residenceId,
      );

    // Lock meterRecord
    await this.meterRecordService.lockMeterRecord(meterRecord._id);
    // Set isBillGenerated to true
    await this.meterRecordService.setBillGenerated(meterRecord._id);

    // Create bill
    const createdBill = await new this.billModel({
      residence: residenceId,
      ...createBillDto,
      created_at: new Date(),
      updated_at: new Date(),
    }).save();

    // Add bill to residence
    await this.residenceService.addBillToResidence(
      residenceId,
      createdBill._id,
    );

    // Add bill to meterRecord
    await this.meterRecordService.addBillToMeterRecord(
      meterRecord._id,
      createdBill._id,
    );

    // Create billRoom from meterRecordItems
    const meterRecordItems = meterRecord.meterRecordItems
      .filter(meterRecordItem => createBillDto.meterRecordItems.includes(meterRecordItem._id.toString()));

    console.log({ meterRecordItems });

    // CreateBillRooms
    meterRecordItems.forEach(async (meterRecordItem) => {
      const room = await this.roomService.findOneRoom(
        residenceId,
        meterRecordItem.room._id,
      );

      // Get water, electric and rentalPrice
      const waterPriceRate = residence.defaultWaterPriceRate;
      const electricPriceRate = residence.defaultElectricPriceRate;

      const roomRentalPrice = room.roomRentalPrice;

      // Calculate bill price
      const waterTotalPrice =
        waterPriceRate * meterRecordItem.totalWaterMeterUsage;
      const electricTotalPrice =
        electricPriceRate * meterRecordItem.totalElectricMeterUsage;

      const fees = room.fees;
      const totalFeesPrice = fees.reduce((acc, fee) => acc + fee.feeprice, 0);

      const totalPrice = roomRentalPrice + waterTotalPrice + electricTotalPrice + totalFeesPrice;

      const billRoomData = {
        billNo: this.generateBillNumber(10),
        room: room._id,
        bill: createdBill._id,
        meterRecord: meterRecord._id,
        fees,
        totalFeesPrice,
        meterRecordItem: meterRecordItem._id,
        waterPriceRate,
        totalWaterMeterUsage: meterRecordItem.totalWaterMeterUsage,
        waterTotalPrice,
        electricPriceRate,
        totalElectricMeterUsage: meterRecordItem.totalElectricMeterUsage,
        roomRentalPrice,
        electricTotalPrice,
        totalPrice,
        currentWaterMeter: meterRecordItem.currentWaterMeter,
        previousWaterMeter: meterRecordItem.previousWaterMeter,
        previousElectricMeter: meterRecordItem.previousElectricMeter,
        currentElectricMeter: meterRecordItem.currentElectricMeter,
      };

      const createdBillRoom = await new this.billRoomModel({
        ...billRoomData,
      }).save();
      // Add BillRoom to room
      await this.roomService.addBillRoomToRoom(
        residenceId,
        room._id,
        createdBillRoom._id,
      );

      // Add BillRoom to Bill
      await this.addBillRoomToBill(createdBill._id, createdBillRoom._id);
    });

    return createdBill;
  }

  async getBillByResidence(residenceId: string): Promise<Bill[]> {
    return this.billModel
      .find({ residence: residenceId })
      .populate('billRooms')
      .populate('meterRecord')
      .populate({
        path: 'billRooms',
        populate: {
          path: 'room',
        },
      })
      .populate({
        path: 'billRooms',
        populate: {
          path: 'fees',
        },
      })
      .sort({
        created_at: -1, // Sort by record_date in meterRecord in descending order
      })
      .exec();
  }

  async getBillById(residenceId: string, billId: string): Promise<Bill> {
    return this.billModel
      .findOne({
        _id: billId,
        residence: residenceId,
      })
      .populate('billRooms')
      .populate('meterRecord')
      .populate({
        path: 'meterRecord',
        populate: {
          path: 'meterRecordItems',
          populate: {
            path: 'room',
          },
        },
      })
      .sort({
        'meterRecord.record_date': -1, // Sort by record_date in meterRecord in descending order
      })
      .exec();
  }

  async addBillRoomToBill(billId: string, billRoomId: string) {
    return this.billModel.findByIdAndUpdate(billId, {
      $push: {
        billRooms: billRoomId,
      },
    });
  }

  async updateBill(
    residenceId: string,
    billId: string,
    updateBillDto: UpdateBillDto,
  ) {
    return null;
  }

  async updateBillRoom(
    billId: string,
    billRoomId: string,
    updateBillRoomDto: UpdateBillRoomDto,
  ): Promise<BillRoom> {
    return await this.billRoomModel.findOneAndUpdate({
      _id: billRoomId,
      bill: billId,
    }, {
      ...updateBillRoomDto,
      updated_at: new Date(),
    }, { new: true }).exec();
  }


}
