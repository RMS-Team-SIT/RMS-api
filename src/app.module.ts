import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ResidentModule } from './resident/resident.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './user/role/guard/user-role.guard';
import { AuthGuard } from './auth/guard/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.dev.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule,
    AuthModule,
    ResidentModule,
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard,
  }],
})
export class AppModule { }
