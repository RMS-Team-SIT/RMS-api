import { Module } from '@nestjs/common';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Fee, FeeSchema } from './schemas/fee.schema';
import { ResidenceModule } from 'src/residence/residence.module';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Fee.name, schema: FeeSchema }
    ]),
    ResidenceModule,
    RoomModule,
  ],
  providers: [FeesService],
  controllers: [FeesController],
  exports: [FeesService],
})
export class FeesModule { }
