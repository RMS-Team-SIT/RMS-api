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
import * as AdminData from './data/admin_data.json';
import * as FacilityData from './data/facility_data.json';
import { MeterRecordModule } from './meter-record/meter-record.module';
import { PaymentModule } from './payment/payment.module';
import { RoomModule } from './room/room.module';
import { BillModule } from './bill/bill.module';
import { NotificationModule } from './notification/notification.module';
import { RolesGuard } from './auth/guard/user-role.guard';
import { AdminModule } from './admin/admin.module';
import { UserRole } from './auth/enum/user-role.enum';
import { RenterModule } from './renter/renter.module';
import { FacilityModule } from './facility/facility.module';
import { FeesModule } from './fees/fees.module';
import { RoomTypeController } from './room-type/room-type.controller';
import { RoomTypeModule } from './room-type/room-type.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { RMSConfigModule } from './rms-config/rms-config.module';

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
    RMSConfigModule,
    ResidenceModule,
    BankModule,
    AuthModule,
    UserModule,
    HealthModule,
    MailModule,
    LineModule,
    FilesModule,
    MeterRecordModule,
    RoomTypeModule,
    RoomModule,
    MeterRecordModule,
    BillModule,
    NotificationModule,
    AdminModule,
    RenterModule,
    PaymentModule,
    FacilityModule,
    FeesModule,
    PrometheusModule.register({
      path: '/metrics',
    }),
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
  controllers: [RoomTypeController],
})
export class AppModule implements OnModuleInit {
  @InjectConnection() private connection: Connection;

  async onModuleInit() {
    try {
      console.log('AppModule initialized');
      await this.initBankData();
      await this.initAdminData();
      await this.initFacilityData();
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
        await bankCollection.insertOne({
          _id: objId,
          ...bank,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
      console.log('Bank data initialized successfully.');
    } else {
      console.log('Bank data already exists.');
    }
  }
  private async initAdminData() {
    const userCollection = this.connection.collection('users');
    const adminCount = await userCollection.countDocuments({
      role: UserRole.ADMIN,
    });

    if (adminCount !== AdminData.length) {
      // Clear all admin data
      await userCollection.deleteMany({ role: UserRole.ADMIN });
      console.log('Initializing admin data from JSON file...');
      for (const admin of AdminData) {
        console.log('Inserting admin:', admin.email);
        const objId = new Types.ObjectId(admin.objId);
        await userCollection.insertOne({ _id: objId, ...admin });
      }
      console.log('Admin data initialized successfully.');
    } else {
      console.log('Admins already exists.');
    }
  }

  private async initFacilityData() {
    const collection = this.connection.collection('facilities');
    const count = await collection.countDocuments();

    if (count === 0) {
      console.log('Initializing facilities data from JSON file...');
      for (const facility of FacilityData) {
        console.log('Inserting facilities:', facility.name);
        const objId = new Types.ObjectId(facility.objId);
        await collection.insertOne({
          _id: objId,
          ...facility,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
      console.log('facilities data initialized successfully.');
    } else {
      console.log('facilities data already exists.');
    }
  }
}
