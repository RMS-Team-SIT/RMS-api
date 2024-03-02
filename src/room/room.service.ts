import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './schemas/room.schema';
import { Model } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { ResidenceService } from 'src/residence/residence.service';
import { validateObjectIdFormat } from 'src/utils/mongo.utils';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RenterService } from 'src/renter/renter.service';
import { CreateManyRoomDto } from './dto/create-many-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name)
    private roomModel: Model<Room>,
    private readonly residenceService: ResidenceService,
    private readonly renterService: RenterService,
  ) { }

  private async checkRoomNameExist(
    name: string,
    residenceId: string,
    roomId?: string,
  ): Promise<void> {
    const filter = { name, residence: residenceId };

    if (roomId) {
      filter['_id'] = { $ne: roomId };
    }

    const room = await this.roomModel.findOne(filter).exec();

    if (room) {
      throw new BadRequestException('Room name is exist');
    }
  }

  private async findOne(roomId: string): Promise<Room> {
    const room = await this.roomModel.findById(roomId).exec();
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  async createRoom(
    residenceId: string,
    createRoomDto: CreateRoomDto,
  ): Promise<Room> {
    // Check residence is exist
    const residence = await this.residenceService.findOne(residenceId);

    // Check room name is exist
    // await this.checkRoomNameExist(createRoomDto.name, residenceId);

    // check is renter exist, renter active, not in other room
    if (createRoomDto.currentRenter) {
      // check is new renter exist
      await this.renterService.findOneRenter(createRoomDto.currentRenter, true);

      const room = await this.roomModel
        .findOne({
          currentRenter: createRoomDto.currentRenter,
          residence: residenceId,
        })
        .exec();
      if (room) {
        throw new BadRequestException('Renter is exist in other room');
      }
    }

    // Set the default price rate if isUseDefaultPriceRate is true.
    // if (createRoomDto.isUseDefaultWaterPriceRate) {
    //   createRoomDto.waterPriceRate = residence.defaultWaterPriceRate;
    // }
    // if (createRoomDto.isUseDefaultElectricPriceRate) {
    //   createRoomDto.electricPriceRate = residence.defaultElectricPriceRate;
    // }

    // Create room
    const createdRoom = await new this.roomModel({
      ...createRoomDto,
      residence: residenceId,
      isActive: true,
    }).save();

    // Save room to residence
    await this.residenceService.addRoomToResidence(
      residenceId,
      createdRoom._id,
    );

    // Save room to renter
    if (createRoomDto.currentRenter) {
      await this.renterService.addRoomToRenter(
        createRoomDto.currentRenter,
        createdRoom._id,
      );
    }

    return createdRoom;
  }

  async createMany(residenceId: string, dto: CreateRoomDto[]): Promise<Room[]> {
    const createRooms = dto.map(i => {
      return new this.roomModel({
        residence: residenceId,
        ...i
      });
    });
    return this.roomModel.insertMany(createRooms);
  }

  async createManyRoomWizard(
    residenceId: string,
    createManyRoomDto: CreateManyRoomDto,
  ): Promise<any> {
    // Check residence is exist
    const residence = await this.residenceService.findOne(residenceId);

    const numberOfFloor = createManyRoomDto.numberOfFloor;
    const numberOfRoomEachFloor = createManyRoomDto.numberOfRoomEachFloor;

    if (numberOfFloor !== numberOfRoomEachFloor.length)
      throw new BadRequestException(
        'Number of floor and number of room each floor is not match',
      );

    const rooms = [];
    const startRoomForEachFloor =
      await this.findLastRoomNumberInEachFloor(residenceId);
    for (let floor = 1; floor <= numberOfFloor; floor++) {
      // start room number for each floor eg 101, 201, 301
      const startRoom = startRoomForEachFloor[floor]
        ? parseInt(startRoomForEachFloor[floor]) + 1
        : floor * 100 + 1;
      const endRoom = startRoom + numberOfRoomEachFloor[floor - 1] - 1;
      for (
        let currentRoomNumber = startRoom;
        currentRoomNumber <= endRoom;
        currentRoomNumber++
      ) {
        const room = {
          name: `${currentRoomNumber.toString().padStart(2, '0')}`,
          residence: residenceId,
          floor: floor,
          waterPriceRate: createManyRoomDto.waterPriceRate,
          roomRentalPrice: createManyRoomDto.roomRentalPrice,
          electricPriceRate: createManyRoomDto.electricPriceRate,
          isUseDefaultWaterPriceRate:
            createManyRoomDto.isUseDefaultWaterPriceRate,
          isUseDefaultElectricPriceRate:
            createManyRoomDto.isUseDefaultElectricPriceRate,
          isActive: true,
        };
        console.log(room);
        rooms.push(room);
      }
    }

    // Create room
    const createdRooms = await this.roomModel.insertMany(rooms);

    // Save rooms to residence
    await this.residenceService.addRoomsToResidence(
      residenceId,
      createdRooms.map((r) => r._id),
    );

    return createdRooms;
  }

  async findAllRoomInResidence(residenceId: string): Promise<Room[]> {
    validateObjectIdFormat(residenceId, 'Residence');

    return this.roomModel.find({ residence: residenceId }).exec();
  }

  async findOneRoom(residenceId: string, roomId: string): Promise<Room> {
    validateObjectIdFormat(roomId, 'Room');
    validateObjectIdFormat(residenceId, 'Room');

    const room = await this.roomModel
      .findOne({ _id: roomId, residence: residenceId })
      .populate({
        path: 'billRooms',
        populate: {
          path: 'meterRecord',
          select: {
            record_date: 1,
          },
        },
      })
      .populate('currentRenter')
      .exec();

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async findLastRoomNumberInEachFloor(residenceId: string): Promise<any> {
    validateObjectIdFormat(residenceId, 'Residence');

    const rooms = await this.roomModel
      .find({ residence: residenceId })
      .select({ floor: 1, name: 1 })
      .exec();

    const lastRoomNumberInEachFloor = rooms.reduce((acc, room) => {
      if (!acc[room.floor] || acc[room.floor] < room.name) {
        acc[room.floor] = room.name;
      }
      return acc;
    }, {});

    return lastRoomNumberInEachFloor;
  }

  async updateRoom(
    residenceId: string,
    roomId: string,
    updateRoomDto: UpdateRoomDto,
  ): Promise<Room> {
    validateObjectIdFormat(residenceId, 'Residence');
    validateObjectIdFormat(roomId, 'Room');

    // check room is exist
    const room = await this.findOne(roomId);

    // check residence is exist
    const residence = await this.residenceService.findOne(residenceId);

    // check room name is exist except this room
    // await this.checkRoomNameExist(updateRoomDto.name, residenceId, roomId);

    // check if rantal update
    if (updateRoomDto.currentRenter) {
      // check is new renter exist
      const renter = await this.renterService.findOneRenter(
        updateRoomDto.currentRenter,
        true,
      );

      // check: Is new renter not in other room
      const renterRoom = await this.roomModel
        .findOne({
          currentRenter: updateRoomDto.currentRenter,
          _id: { $ne: roomId },
        })
        .exec();
      if (renterRoom) {
        throw new BadRequestException('Renter is exist in other room');
      }

      // Remove room from old renter if exist
      if (room.currentRenter) {
        await this.renterService.removeRoomFromRenter(room.currentRenter);
      }

      // Update new renter: set room to this room
      await this.renterService.addRoomToRenter(
        updateRoomDto.currentRenter,
        roomId,
      );
    } else {
      // remove room from old renter if exist
      if (room.currentRenter) {
        await this.renterService.removeRoomFromRenter(room.currentRenter);
      }
    }

    // Set the default price rate if isUseDefaultPriceRate is true.
    // if (updateRoomDto.isUseDefaultWaterPriceRate) {
    //   updateRoomDto.waterPriceRate = residence.defaultWaterPriceRate;
    // }
    // if (updateRoomDto.isUseDefaultElectricPriceRate) {
    //   updateRoomDto.electricPriceRate = residence.defaultElectricPriceRate;
    // }

    // update room
    return await this.roomModel
      .findByIdAndUpdate(
        roomId,
        {
          ...updateRoomDto,
          updated_at: Date.now(),
        },
        { new: true },
      )
      .exec();
  }

  async deleteRoom(residenceId: string, roomId: string): Promise<Room> {
    validateObjectIdFormat(residenceId, 'Residence');
    validateObjectIdFormat(roomId, 'Room');

    // Delete room in residence
    await this.residenceService.removeRoomFromResidence(residenceId, roomId);

    // Delete room
    return this.roomModel.findByIdAndDelete(roomId).exec();
  }

  // Room
  async addBillRoomToRoom(
    residenceId: string,
    roomId: string,
    billRoomId: string,
  ): Promise<Room> {
    validateObjectIdFormat(residenceId, 'Residence');
    validateObjectIdFormat(roomId, 'Room');
    validateObjectIdFormat(billRoomId, 'BillRoom');

    return this.roomModel
      .findOneAndUpdate(
        { _id: roomId },
        { $push: { billRooms: billRoomId } },
        { new: true },
      )
      .exec();
  }
}
