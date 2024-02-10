import { Module } from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from './schemas/bank.schema';
import { Connection } from 'mongoose';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bank.name, schema: BankSchema }]),
  ],
  controllers: [BankController],
  providers: [BankService],
  exports: [BankService],
})
export class BankModule {}
