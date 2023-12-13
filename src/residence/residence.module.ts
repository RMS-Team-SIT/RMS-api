import { Module } from '@nestjs/common';
import { ResidenceService } from './residence.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schemas/room.schema';
import { Residence, ResidenceSchema } from './schemas/residence.schema';
import { Renter, RenterSchema } from './schemas/renter.schema';
import { ResidenceController } from './residence.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Residence.name, schema: ResidenceSchema },
      { name: Room.name, schema: RoomSchema },
      { name: Renter.name, schema: RenterSchema },
    ]),
  ],
  controllers: [ResidenceController],
  providers: [ResidenceService],
  exports: [ResidenceService],
})
export class ResidenceModule { }
