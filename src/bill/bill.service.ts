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

  async createBill(residenceId: string, createBillDto: CreateBillDto) {

    const residence = await this.residenceService.findOne(residenceId);

    // Find meterRecord
    const meterRecord = await this.meterRecordService.getMeterRecordByIdAndResidenceId(createBillDto.meterRecord, residenceId);


    // Lock meterRecord 
    await this.meterRecordService.lockMeterRecord(meterRecord._id);

    // Create bill for every room in meterRecord
    const meterRecordItems = meterRecord.meterRecordItems;
    console.log('creating for rooms:', meterRecordItems.map(i => i.room));

    // Create bill
    const createdBill = await new this.billModel({
      ...createBillDto
    }).save();
    console.log('createdBill:', createdBill._id);


    // CreateBillRooms
    meterRecordItems.forEach(async (meterRecordItem) => {
      const room = await this.roomService.findOneRoom(residenceId, meterRecordItem.room._id);

      // Get water, light and rentalPrice
      const waterPriceRate = room.isUseDefaultWaterPriceRate ? residence.defaultWaterPriceRate : room.waterPriceRate;
      const lightPriceRate = room.isUseDefaultLightPriceRate ? residence.defaultLightPriceRate : room.lightPriceRate;
      const roomRentalPrice = room.roomRentalPrice;

      // Calculate bill price
      const waterTotalPrice = waterPriceRate * meterRecordItem.totalWaterMeterUsage;
      const lightTotalPrice = lightPriceRate * meterRecordItem.totalElectricMeterUsage;

      const totalPrice = roomRentalPrice + waterTotalPrice + lightTotalPrice;

      const billRoomData = {
        room: room._id,
        bill: createdBill._id,
        meterRecord: meterRecord._id,
        meterRecordItem: meterRecordItem._id,
        waterPriceRate,
        totalWaterMeterUsage: meterRecordItem.totalWaterMeterUsage,
        waterTotalPrice,
        lightPriceRate,
        totalElectricMeterUsage: meterRecordItem.totalElectricMeterUsage,
        roomRentalPrice,
        lightTotalPrice,
        totalPrice,
      }
      console.log('billRoomData', billRoomData);

      const createdBillRoom = await new this.billRoomModel({ ...billRoomData }).save();
      console.log('Created Bill Room', createdBillRoom);

      // Add BillRoom to room
      await this.roomService.addBillRoomToRoom(residenceId, room._id, createdBillRoom._id);
      console.log('adding billroom to room:', room._id, createdBillRoom._id);

      // Add BillRoom to Bill
      await this.addBillRoomToBill(createdBill._id, createdBillRoom._id);
      console.log('adding billroom to bill:', room._id, createdBillRoom._id);
    });

    return createdBill;
  }

  async addBillRoomToBill(billId: string, billRoomId: string) {
    return this.billModel.findByIdAndUpdate(billId, {
      $push: {
        billRooms: billRoomId
      }
    })
  };
}
