import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ResidenceModule } from './residence/residence.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard';
import { HealthModule } from './health/health.module';
import { MailModule } from './mail/mail.module';
import { LineModule } from './line/line.module';
import { FilesModule } from './files/files.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

const ENV = process.env.NODE_ENV;
console.log(`Current environment: ${ENV}`);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./env/.env.${ENV || 'development'}`,
    }),
    MongooseModule.forRoot(process.env.DB_MONGODB_URI),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60000'),
        limit: parseInt(process.env.RATE_LIMIT_REQUEST_PER_TTL || '100'),
      },
    ]),
    AuthModule,
    UserModule,
    ResidenceModule,
    HealthModule,
    MailModule,
    LineModule,
    FilesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
