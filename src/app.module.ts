import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ResidentModule } from './resident/resident.module';

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
  providers: [],
})
export class AppModule {}
