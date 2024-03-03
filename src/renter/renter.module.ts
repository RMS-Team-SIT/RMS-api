import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Renter, RenterSchema } from './schemas/renter.schema';
import { RenterController } from './renter.controller';
import { RenterService } from './renter.service';
import { ResidenceModule } from 'src/residence/residence.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Renter.name, schema: RenterSchema }]),
    forwardRef(() => ResidenceModule),
  ],
  controllers: [RenterController],
  providers: [RenterService],
  exports: [RenterService],
})
export class RenterModule {}
