import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Resident } from './schemas/resident.schema';
import { CreateResidentDto } from './dtos/create-resident.dto';
import { UpdateResidentDto } from './dtos/update-resident.dto';
import { Rental } from './schemas/rental.schema';
import { CreateRentalDto } from './dtos/create-rental.dto';
import { UpdateRentalDto } from './dtos/update-rental.dto';
import { Room } from './schemas/room.schema';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';

@Injectable()
export class ResidentService {
  constructor(
    @InjectModel(Resident.name)
    private readonly residentModel: Model<Resident>,
    @InjectModel(Rental.name)
    private readonly rentalModel: Model<Rental>,
    @InjectModel(Room.name)
    private readonly roomModel: Model<Room>,
  ) { }

  // Resident
  async create(
    userId: string,
    createResidentDto: CreateResidentDto,
  ): Promise<Resident> {
    const createdResident = new this.residentModel({
      ...createResidentDto,
      owner: userId,
    });
    return createdResident.save();
  }

  async findMyResident(userId: string): Promise<Resident[]> {
    return this.residentModel
      .find({ owner: userId })
      .select({
        __v: 0,
        created_at: 0,
        updated_at: 0,
        'contact._id': 0,
        'contact.created_at': 0,
        'contact.updated_at': 0,
      })
      .populate('owner')
      .populate('rentals')
      .populate('rooms')
      .populate({
        path: 'rooms',
        populate: { path: 'currentRental' },
      })
      .exec();
  }

  async findAll(): Promise<Resident[]> {
    return this.residentModel
      .find()
      .select({
        __v: 0,
        created_at: 0,
        updated_at: 0,
        'contact._id': 0,
        'contact.created_at': 0,
        'contact.updated_at': 0,
      })
      .populate('owner')
      .populate('rentals')
      .populate('rooms')
      .populate({
        path: 'rooms',
        populate: { path: 'currentRental' },
      })
      .exec();
  }

  async findOne(id: string): Promise<Resident> {
    
    this.validateObjectIdFormat(id, 'Resident');
    
    const resident = this.residentModel
      .findById(id)
      .select({
        __v: 0,
        created_at: 0,
        updated_at: 0,
        'contact._id': 0,
        'contact.created_at': 0,
        'contact.updated_at': 0,
      })
      .populate('owner')
      .populate('rentals')
      .populate({
        path: 'rentals',
        populate: { path: 'room' },
      })
      .populate('rooms')
      .populate({
        path: 'rooms',
        populate: { path: 'currentRental' },
      })
      .exec();

    if (!resident) {
      throw new NotFoundException('Resident not found');
    }
    return resident;
  }

  async update(id: string, dto: UpdateResidentDto): Promise<Resident> {

    this.validateObjectIdFormat(id, 'Resident');
    
    return this.residentModel
      .findByIdAndUpdate(
        id,
        {
          ...dto,
          updated_at: Date.now(),
        },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<Resident> {
    
    this.validateObjectIdFormat(id, 'Resident');

    // delete all rental
    await this.rentalModel.deleteMany({ resident: id }).exec();
    // delete all room
    await this.roomModel.deleteMany({ resident: id }).exec();

    return this.residentModel.findByIdAndDelete(id).exec();
  }

  // Rental
  async createRental(residentId: string, createRentalDto: CreateRentalDto): Promise<Rental> {
    
    this.validateObjectIdFormat(residentId, 'Resident');

    // check resident is exist
    const resident = await this.residentModel.findById(residentId).exec();
    if (!resident) {
      throw new NotFoundException('Resident not found');
    }

    const createdRental = await new this.rentalModel({
      ...createRentalDto,
      resident: residentId
    }).save();

    // save rental to resident
    await this.residentModel.findOneAndUpdate(
      { _id: residentId },
      { $push: { rentals: createdRental._id } },
      { new: true },
    ).exec();

    return createdRental;
  }

  async findAllRentalInResident(residentId: string): Promise<Rental[]> {

    this.validateObjectIdFormat(residentId, 'Resident');

    const resident = await this.residentModel
      .findById(residentId)
      .populate('rentals')
      .exec();
    return resident.rentals;
  }

  async findOneRental(rentalId: string): Promise<Rental> {

    this.validateObjectIdFormat(rentalId, 'Rental');

    const rental = await this.rentalModel
      .findById(rentalId)
      .exec();

    if (!rental) {
      throw new NotFoundException('Rental not found');
    }

    return rental;
  }

  async updateRental(
    rentalId: string,
    updateRentalDto: UpdateRentalDto
  ): Promise<Rental> {
    
    this.validateObjectIdFormat(rentalId, 'Rental');

    const updatedRental = await this
      .rentalModel
      .findByIdAndUpdate(rentalId,
        {
          ...updateRentalDto,
          updated_at: Date.now(),
        },
        { new: true }
      ).exec();
    return updatedRental;
  }

  async deleteRental(rentalId: string): Promise<Rental> {

    this.validateObjectIdFormat(rentalId, 'Rental');

    // delete rental in resident
    const rental = await this.rentalModel.findById(rentalId).exec();

    if (!rental) {
      throw new NotFoundException('Rental not found');
    }

    if (rental.room) {
      throw new BadRequestException('Rental is in room. Please remove rental from room first.');
    }

    // delete rental in resident
    await this.residentModel.findOneAndUpdate(
      { _id: rental.resident },
      { $pull: { rentals: rentalId } },
      { new: true },
    ).exec();

    // delete rental
    return this.rentalModel.findByIdAndDelete(rentalId).exec();
  }

  async createRoom(residentId: string, createRoomDto: CreateRoomDto): Promise<Room> {

    this.validateObjectIdFormat(residentId, 'Resident');

    // check resident is exist
    const resident = await this.residentModel.findById(residentId).exec();
    if (!resident) {
      throw new NotFoundException('Resident not found');
    }

    // check room name is exist
    const room = await this.roomModel.findOne({ name: createRoomDto.name, resident: residentId }).exec();
    if (room) {
      throw new BadRequestException('Room name is exist');
    }

    // check is rental exist and not in other room
    if (createRoomDto.currentRental) {
      const rental = await this.rentalModel.findById(createRoomDto.currentRental).exec();
      if (!rental) {
        throw new NotFoundException('Rental not found');
      }
      const room = await this.roomModel.findOne({ currentRental: createRoomDto.currentRental, resident: residentId }).exec();
      if (room) {
        throw new BadRequestException('Rental is exist in other room');
      }
    }

    // set default price rate if isUseDefaultPriceRate is true
    if (createRoomDto.isUseDefaultWaterPriceRate) {
      createRoomDto.waterPriceRate = resident.defaultWaterPriceRate;
    }
    if (createRoomDto.isUseDefaultLightPriceRate) {
      createRoomDto.lightPriceRate = resident.defaultLightPriceRate;
    }

    // create room
    const createdRoom = await new this.roomModel({
      ...createRoomDto,
      resident: residentId,
    }).save();

    // save room to resident
    await this.residentModel.findOneAndUpdate(
      { _id: residentId },
      { $push: { rooms: createdRoom._id } },
      { new: true },
    ).exec();

    // save room to rental
    if (createRoomDto.currentRental) {
      await this.rentalModel.findOneAndUpdate(
        { _id: createRoomDto.currentRental },
        { $set: { room: createdRoom._id } },
        { new: true },
      ).exec();
    }

    return createdRoom;
  }

  async findAllRoomInResident(residentId: string): Promise<Room[]> {

    this.validateObjectIdFormat(residentId, 'Resident');

    const resident = await this
      .residentModel
      .findById(residentId)
      .populate('rooms')
      .exec();
    return resident.rooms;
  }

  async findOneRoom(roomId: string): Promise<Room> {

    this.validateObjectIdFormat(roomId, 'Room');

    const room = await this.roomModel.findById(roomId).exec();

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async updateRoom(
    residentId: string,
    roomId: string,
    updateRoomDto: UpdateRoomDto
  ): Promise<Room> {

    this.validateObjectIdFormat(residentId, 'Resident');
    this.validateObjectIdFormat(roomId, 'Room');

    // check resident is exist
    const resident = await this.residentModel.findById(residentId).exec();
    if (!resident) {
      throw new NotFoundException('Resident not found');
    }

    // check room is exist
    const room = await this.roomModel.findById(roomId).exec();
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // check room name is exist except this room
    const duplicateRoomName = await this.roomModel.findOne({ name: updateRoomDto.name, _id: { $ne: roomId } }).exec();
    if (duplicateRoomName) {
      throw new BadRequestException('Room name is exist');
    }

    // check if rantal update
    if (updateRoomDto.currentRental) {

      // check is new rental exist
      const rental = await this.rentalModel.findById(updateRoomDto.currentRental).exec();
      if (!rental) {
        throw new NotFoundException('Rental not found');
      }

      // check is new rental not in other room
      const rentalRoom = await this.roomModel.findOne({ currentRental: updateRoomDto.currentRental, _id: { $ne: roomId } }).exec();
      if (rentalRoom) {
        throw new BadRequestException('Rental is exist in other room');
      }

      // remove room from old rental if exist
      if (room.currentRental) {
        console.log('remove room from old rental');

        const temp = await this.rentalModel.findOneAndUpdate(
          { _id: room.currentRental },
          { $set: { room: null } },
          { new: true },
        ).exec();
        console.log('temp', temp);

      }

      // update new rental set room to this room 
      await this.rentalModel.findOneAndUpdate(
        { _id: updateRoomDto.currentRental },
        { $set: { room: roomId } },
        { new: true },
      ).exec();
    } else {

      // remove room from old rental if exist
      if (room.currentRental) {
        console.log('remove room from old rental');

        const temp = await this.rentalModel.findOneAndUpdate(
          { _id: room.currentRental },
          { $set: { room: null } },
          { new: true },
        ).exec();
        console.log('temp', temp);

      }
    }

    // set default price rate if isUseDefaultPriceRate is true
    if (updateRoomDto.isUseDefaultWaterPriceRate) {
      updateRoomDto.waterPriceRate = resident.defaultWaterPriceRate;
    }
    if (updateRoomDto.isUseDefaultLightPriceRate) {
      updateRoomDto.lightPriceRate = resident.defaultLightPriceRate;
    }

    // update room
    const updatedRoom = await this
      .roomModel
      .findByIdAndUpdate(roomId,
        {
          ...updateRoomDto,
          updated_at: Date.now(),
        },
        { new: true }
      ).exec();

    return updatedRoom;
  }

  async deleteRoomInResident(residentId: string, roomId: string): Promise<Room> {

    this.validateObjectIdFormat(residentId, 'Resident');
    this.validateObjectIdFormat(roomId, 'Room');

    // delete room in resident
    await this.residentModel.findOneAndUpdate(
      { _id: residentId },
      { $pull: { rooms: roomId } },
      { new: true },
    ).exec();

    // delete room
    return this.roomModel.findByIdAndDelete(roomId).exec();
  }

  private validateObjectIdFormat(objectId: string, fieldName?: string): boolean {
    if (!Types.ObjectId.isValid(objectId)) {
      throw new BadRequestException(`${fieldName || 'Object'} id is invalid format`);
    }
    return true;
  }
}
