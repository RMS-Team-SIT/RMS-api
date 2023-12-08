import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
      .exec();
  }

  async findOne(id: string): Promise<Resident> {
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
      .exec();
    if (!resident) {
      throw new NotFoundException('Resident not found');
    }
    return resident;
  }

  async update(id: string, dto: UpdateResidentDto): Promise<Resident> {
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
    return this.residentModel.findByIdAndDelete(id).exec();
  }

  // Rental
  async createRental(id: string, createRentalDto: CreateRentalDto): Promise<Rental> {
    const createdRental = await new this.rentalModel(createRentalDto).save();
    console.log('created rental', createdRental);

    // save rental to resident
    await this.residentModel.findOneAndUpdate(
      { _id: id },
      { $push: { rentals: createdRental._id } },
      { new: true },
    ).exec();

    return createdRental;
  }

  async findAllRentalInResident(residentId: string): Promise<Rental[]> {
    const resident = await this.residentModel.findById(residentId).exec();
    return resident.rentals;
  }

  async findOneRentalInResident(residentId: string, rentalId: string): Promise<Rental> {
    const resident = await this.residentModel.findOne({
      _id: residentId,
      'rentals._id': rentalId,
    })
      .select('rentals.$')
      .exec();

    if (!resident) {
      throw new NotFoundException('Rental not found');
    }

    return resident.rentals[0];
  }

  async updateRentalInResident(
    residentId: string,
    rentalId: string,
    updateRentalDto: UpdateRentalDto
  ): Promise<Rental> {

    const resident = await this.residentModel.findOneAndUpdate(
      {
        _id: residentId,
        'rentals._id': rentalId,
      },
      {
        $set: {
          'rentals.$': { ...updateRentalDto, updated_at: Date.now() },
        },
      },
      { new: true },
    ).exec();

    return resident.rentals[0];
  }

  async createRoom(residentId: string, createRoomDto: CreateRoomDto): Promise<Room[]> {
    const resident = await this.residentModel.findOneAndUpdate(
      { _id: residentId },
      { $push: { rooms: { ...createRoomDto } } },
      { new: true },
    ).exec();

    return resident.rooms;
  }

  async findAllRoomInResident(residentId: string): Promise<Room[]> {
    const resident = await this.residentModel.findById(residentId).exec();
    return resident.rooms;
  }

  async findOneRoomInResident(residentId: string, roomId: string): Promise<Room> {
    const resident = await this.residentModel.findOne({
      _id: residentId,
      'rooms._id': roomId,
    })
      .select('rooms.$')
      .exec();

    if (!resident) {
      throw new NotFoundException('Room not found');
    }

    return resident.rooms[0];
  }

  async updateRoomInResident(
    residentId: string,
    roomId: string,
    updateRoomDto: UpdateRoomDto
  ): Promise<Room> {

    const resident = await this.residentModel.findOneAndUpdate(
      {
        _id: residentId,
        'rooms._id': roomId,
      },
      {
        $set: {
          'rooms.$': { ...updateRoomDto, updated_at: Date.now() },
        },
      },
      { new: true },
    ).exec();

    return resident.rooms[0];
  }

  async deleteRoomInResident(residentId: string, roomId: string): Promise<Room> {
    const resident = await this.residentModel.findOneAndUpdate(
      { _id: residentId },
      { $pull: { rooms: { _id: roomId } } },
      { new: true },
    ).exec();

    return resident.rooms[0];
  }
}
