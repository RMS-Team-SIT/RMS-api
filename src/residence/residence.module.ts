import { Module, forwardRef } from '@nestjs/common';
import { ResidenceService } from './residence.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Residence, ResidenceSchema } from './schemas/residence.schema';
import { Renter, RenterSchema } from '../renter/schemas/renter.schema';
import { ResidenceController } from './residence.controller';
import { FeesModule } from 'src/fees/fees.module';
import { RoomTypeModule } from 'src/room-type/room-type.module';
import { PaymentModule } from 'src/payment/payment.module';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Residence.name, schema: ResidenceSchema },
      { name: Renter.name, schema: RenterSchema },
    ]),
    FeesModule,
    RoomTypeModule,
    PaymentModule,
  ],
  controllers: [ResidenceController],
  providers: [ResidenceService],
  exports: [ResidenceService],
})
export class ResidenceModule { }
