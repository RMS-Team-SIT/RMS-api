import { Module } from '@nestjs/common';
import { ResidenceService } from './residence.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Residence, ResidenceSchema } from './schemas/residence.schema';
import { Renter, RenterSchema } from '../renter/schemas/renter.schema';
import { ResidenceController } from './residence.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Residence.name, schema: ResidenceSchema },
      { name: Renter.name, schema: RenterSchema },
    ]),
  ],
  controllers: [ResidenceController],
  providers: [ResidenceService],
  exports: [ResidenceService],
})
export class ResidenceModule { }
