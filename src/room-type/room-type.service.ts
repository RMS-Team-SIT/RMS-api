import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RoomType } from './schemas/room-type.schema';
import { Model } from 'mongoose';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectModel(RoomType.name)
    private readonly roomTypeModel: Model<RoomType>,
  ) { }

  async create(
    residenceId: string,
    createRoomTypeDto: CreateRoomTypeDto,
  ): Promise<RoomType> {
    const createdRoomType = new this.roomTypeModel({
      residence: residenceId,
      ...createRoomTypeDto,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return createdRoomType.save();
  }

  async createMany(
    residenceId: string,
    createRoomTypeDtos: CreateRoomTypeDto[],
  ): Promise<RoomType[]> {
    const createdRoomTypes = createRoomTypeDtos.map((createRoomTypeDto) => {
      return new this.roomTypeModel({
        residence: residenceId,
        ...createRoomTypeDto,
        created_at: new Date(),
        updated_at: new Date(),
      });
    });
    return this.roomTypeModel.insertMany(createdRoomTypes);
  }

  async findAllByResidence(residenceId: string): Promise<RoomType[]> {
    return this.roomTypeModel.find({ residence: residenceId }).exec();
  }

  async findOne(id: string): Promise<RoomType> {
    return this.roomTypeModel.findById(id).exec();
  }
}
