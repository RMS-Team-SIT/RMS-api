import { Module, forwardRef } from '@nestjs/common';
import { ResidenceService } from './residence.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Residence, ResidenceSchema } from './schemas/residence.schema';
import { Renter, RenterSchema } from '../renter/schemas/renter.schema';
import { ResidenceController } from './residence.controller';
import { Fee, FeeSchema } from 'src/fees/schemas/fee.schema';
import { Payment, PaymentSchema } from 'src/payment/schemas/payment.schema';
import {
  RoomType,
  RoomTypeSchema,
} from 'src/room-type/schemas/room-type.schema';
import { Room, RoomSchema } from 'src/room/schemas/room.schema';
import { MailModule } from 'src/mail/mail.module';
import { NotificationModule } from 'src/notification/notification.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Residence.name, schema: ResidenceSchema },
      { name: Renter.name, schema: RenterSchema },
      { name: Fee.name, schema: FeeSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: RoomType.name, schema: RoomTypeSchema },
      { name: Room.name, schema: RoomSchema },
    ]),
    MailModule,
    NotificationModule,
    UserModule,
  ],
  controllers: [ResidenceController],
  providers: [ResidenceService],
  exports: [ResidenceService],
})
export class ResidenceModule {}
