import { Module } from '@nestjs/common';
import { UserController } from './resident.controller';
import { UserService } from './resident.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Resident, ResidentSchema } from './schemas/resident.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resident.name, schema: ResidentSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
