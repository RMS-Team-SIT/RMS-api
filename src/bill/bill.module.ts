import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillRoom, BillRoomSchema } from './schemas/bill-room.schema';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { Bill, BillSchema } from './schemas/bill.schema';
import { ResidenceModule } from 'src/residence/residence.module';
import { RoomModule } from 'src/room/room.module';
import { MeterRecordModule } from 'src/meter-record/meter-record.module';
import { NotificationModule } from 'src/notification/notification.module';
import { UserModule } from 'src/user/user.module';
import { RenterModule } from 'src/renter/renter.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BillRoom.name, schema: BillRoomSchema },
      { name: Bill.name, schema: BillSchema },
    ]),
    ResidenceModule,
    RoomModule,
    MeterRecordModule,
    NotificationModule,
    UserModule,
    RenterModule,
  ],
  providers: [BillService],
  controllers: [BillController],
  exports: [BillService],
})
export class BillModule {}
