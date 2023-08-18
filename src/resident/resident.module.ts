import { Module } from '@nestjs/common';
import { UserController } from './resident.controller';
import { UserService } from './resident.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/resident.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
