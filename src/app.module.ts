import { Module, NestModule, MiddlewareConsumer  } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath : '.dev.env'
  }),MongooseModule.forRoot(process.env.MONGODB_URI),UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {
}
