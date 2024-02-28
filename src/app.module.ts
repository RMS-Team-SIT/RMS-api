import { Module, OnModuleInit } from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard';
import { HealthModule } from './health/health.module';
import { MailModule } from './mail/mail.module';
import { LineModule } from './line/line.module';
import { FilesModule } from './files/files.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ResidenceModule } from './residence/residence.module';
import { Connection, Types } from 'mongoose';
import { BankModule } from './bank/bank.module';
import * as BankData from './data/bank_cleaned.json';
import { MeterRecordModule } from './meter-record/meter-record.module';
import { PaymentModule } from './payment/payment.module';
import { RoomModule } from './room/room.module';
import { BillModule } from './bill/bill.module';
import { NotificationModule } from './notification/notification.module';
import { RolesGuard } from './auth/guard/user-role.guard';
import { AdminModule } from './admin/admin.module';

const ENV = process.env.NODE_ENV || 'development';
console.log(`Current environment: ${ENV}`);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./env/.env.${ENV}`,
    }),
    MongooseModule.forRoot(process.env.DB_MONGODB_URI),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60000'),
        limit: parseInt(process.env.RATE_LIMIT_REQUEST_PER_TTL || '100'),
      },
    ]),
    ResidenceModule,
    BankModule,
    AuthModule,
    UserModule,
    HealthModule,
    MailModule,
    LineModule,
    FilesModule,
    MeterRecordModule,
    PaymentModule,
    RoomModule,
    MeterRecordModule,
    BillModule,
    NotificationModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  @InjectConnection() private connection: Connection;

  async onModuleInit() {
    try {
      console.log('AppModule initialized');
      await this.initBankData();
    } catch (error) {
      console.error('Error initializing AppModule:', error);
    }
  }

  private async initBankData() {
    const bankCollection = this.connection.collection('banks');
    const bankCount = await bankCollection.countDocuments();

    if (bankCount === 0) {
      console.log('Initializing bank data from JSON file...');
      for (const bank of BankData) {
        console.log('Inserting bank:', bank.bank);
        const objId = new Types.ObjectId(bank.objId);
        await bankCollection.insertOne({ _id: objId, ...bank });
      }
      console.log('Bank data initialized successfully.');
    } else {
      console.log('Bank data already exists.');
    }
  }
}
