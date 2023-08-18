import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.dev.env'
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI), UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
