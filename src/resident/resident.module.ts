import { Module } from '@nestjs/common';
import { ResidentController } from './resident.controller';
import { ResidentService } from './resident.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Resident, ResidentSchema } from './schemas/resident.schema';
import { Rental, RentalSchema } from './schemas/rental.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resident.name, schema: ResidentSchema },
      { name: Rental.name, schema: RentalSchema },
    ]),
  ],
  controllers: [ResidentController],
  providers: [ResidentService],
  exports: [ResidentService],
})
export class ResidentModule {}
