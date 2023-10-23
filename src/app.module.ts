import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ResidentModule } from './resident/resident.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard';
import { HealthModule } from './health/health.module';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { LineController } from './line/line.controller';
import { LineService } from './line/line.service';
import { LineModule } from './line/line.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.dev.env',
    }),
    MongooseModule.forRoot(process.env.DB_MONGODB_URI),
    UserModule,
    AuthModule,
    ResidentModule,
    HealthModule,
    MailModule,
    LineModule,
  ],
  controllers: [LineController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    LineService,
  ],
})
export class AppModule { }
