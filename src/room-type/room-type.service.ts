import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RoomType } from './schemas/room-type.schema';
import { Model } from 'mongoose';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { ResidenceService } from 'src/residence/residence.service';

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectModel(RoomType.name)
    private readonly roomTypeModel: Model<RoomType>,
    private readonly residenceService: ResidenceService,
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
    console.log({ residenceId, createRoomTypeDtos });

    const createdRoomTypes = createRoomTypeDtos.map((createRoomTypeDto) => {
      return new this.roomTypeModel({
        residence: residenceId,
        ...createRoomTypeDto,
        created_at: new Date(),
        updated_at: new Date(),
      });
    });

    await this.residenceService.addRoomTypesToResidence(
      residenceId,
      createdRoomTypes.map((roomType) => roomType._id),
    );

    return this.roomTypeModel.insertMany(createdRoomTypes);
  }

  async findAllByResidence(residenceId: string): Promise<RoomType[]> {
    return this.roomTypeModel.find({ residence: residenceId }).exec();
  }

  async findOne(id: string): Promise<RoomType> {
    return this.roomTypeModel.findById(id).exec();
  }
}
