import { Module } from '@nestjs/common';
import { RoomTypeController } from './room-type.controller';
import { RoomTypeService } from './room-type.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomType, RoomTypeSchema } from './schemas/room-type.schema';
import { ResidenceModule } from 'src/residence/residence.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RoomType.name,
        schema: RoomTypeSchema,
      },
    ]),
    ResidenceModule,
  ],
  controllers: [RoomTypeController],
  providers: [RoomTypeService],
  exports: [RoomTypeService],
})
export class RoomTypeModule { }
