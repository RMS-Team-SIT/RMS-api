import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Residence } from './schemas/residence.schema';
import { CreateResidenceDto } from './dtos/create-residence.dto';
import { UpdateResidenceDto } from './dtos/update-residence.dto';
import { Renter } from './schemas/renter.schema';
import { CreateRenterDto } from './dtos/create-renter.dto';
import { UpdateRenterDto } from './dtos/update-renter.dto';
import { Room } from './schemas/room.schema';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { CreateResidencePaymentDto } from './dtos/create-residence-payment.dto';
import { Payment } from './schemas/payment.schema';

@Injectable()
export class ResidenceService {
  constructor(
    @InjectModel(Residence.name)
    private readonly residenceModel: Model<Residence>,
    @InjectModel(Renter.name)
    private readonly renterModel: Model<Renter>,
    @InjectModel(Room.name)
    private readonly roomModel: Model<Room>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
  ) { }

  // Residence
  async create(
    userId: string,
    createResidenceDto: CreateResidenceDto,
  ): Promise<Residence> {
    const createdResidence = new this.residenceModel({
      ...createResidenceDto,
      owner: userId,
    });
    return createdResidence.save();
  }

  async findMyResidence(userId: string): Promise<Residence[]> {
    return this.residenceModel
      .find({ owner: userId })
      .select({
        __v: 0
      })
      .populate({
        path: 'owner',
        select: {
          _id: 1,
        }
      })
      .populate('renters')
      .populate('rooms')
      .populate({
        path: 'rooms',
        populate: { path: 'currentRenter' },
      })
      .exec();
  }

  async findOne(id: string): Promise<Residence> {
    this.validateObjectIdFormat(id, 'Residence');

    const residence = this.residenceModel
      .findById(id)
      .select({
        __v: 0,
        created_at: 0,
        updated_at: 0,
      })
      .populate({
        path: 'owner',
        select: {
          _id: 1,
        }
      })
      .populate('renters')
      .populate({
        path: 'renters',
        populate: { path: 'room' },
      })
      .populate('rooms')
      .populate({
        path: 'rooms',
        populate: { path: 'currentRenter' },
      })
      .exec();

    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    return residence;
  }

  async update(id: string, dto: UpdateResidenceDto): Promise<Residence> {
    this.validateObjectIdFormat(id, 'Residence');

    return this.residenceModel
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

  async delete(id: string): Promise<Residence> {
    this.validateObjectIdFormat(id, 'Residence');

    // delete all renter
    await this.renterModel.deleteMany({ residence: id }).exec();
    // delete all room
    await this.roomModel.deleteMany({ residence: id }).exec();

    return this.residenceModel.findByIdAndDelete(id).exec();
  }

  // Renter
  async createRenter(
    residenceId: string,
    createRenterDto: CreateRenterDto,
  ): Promise<Renter> {
    this.validateObjectIdFormat(residenceId, 'Residence');

    // check residence is exist
    const residence = await this.residenceModel.findById(residenceId).exec();
    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    // check renter username is exist
    const duplicateRenter = await this.renterModel
      .findOne({
        username: createRenterDto.username,
        residence: residenceId,
      })
      .exec();
    if (duplicateRenter) {
      throw new BadRequestException('Renter username is exist');
    }

    const createdRenter = await new this.renterModel({
      ...createRenterDto,
      residence: residenceId,
    }).save();

    // save renter to residence
    await this.residenceModel
      .findOneAndUpdate(
        { _id: residenceId },
        { $push: { renters: createdRenter._id } },
        { new: true },
      )
      .exec();

    return createdRenter;
  }

  async findAllRenterInResidence(residenceId: string): Promise<Renter[]> {
    this.validateObjectIdFormat(residenceId, 'Residence');

    const residence = await this.residenceModel
      .findById(residenceId)
      .populate('renters')
      .exec();
    return residence.renters;
  }

  async findOneRenter(renterId: string): Promise<Renter> {
    this.validateObjectIdFormat(renterId, 'Renter');

    const renter = await this
      .renterModel
      .findById(renterId)
      .populate({
        path: 'room',
        select: {
          _id: 1,
          name: 1,
        }
      })
      .exec();

    if (!renter) {
      throw new NotFoundException('Renter not found');
    }

    return renter;
  }

  async updateRenter(
    residenceId: string,
    renterId: string,
    updateRenterDto: UpdateRenterDto,
  ): Promise<Renter> {

    this.validateObjectIdFormat(renterId, 'Renter');
    this.validateObjectIdFormat(residenceId, 'Residence');

    // check residence is exist
    const residence = await this.residenceModel.findById(residenceId).exec();
    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    // check renter is exist
    const renter = await this.renterModel.findById(renterId).exec();
    if (!renter) {
      throw new NotFoundException('Renter not found');
    }

    // check renter is active or not
    if (!renter.isActive) {
      throw new BadRequestException('Renter is inactive. Please reactive renter first.');
    }

    // check renter username is exist in this residence except this renter
    const duplicateRenter = await this.renterModel
      .findOne({
        residence: residenceId,
        username: updateRenterDto.username,
        _id: { $ne: renterId },
      })
      .exec();
    if (duplicateRenter) {
      throw new BadRequestException('Renter username is exist');
    }

    // update renter
    const updatedRenter = await this.renterModel
      .findByIdAndUpdate(
        renterId,
        {
          ...updateRenterDto,
          updated_at: Date.now(),
        },
        { new: true },
      )
      .exec();
    return updatedRenter;
  }

  async deleteRenter(renterId: string, deleteType: 'soft' | 'hard'): Promise<Renter> {
    this.validateObjectIdFormat(renterId, 'Renter');

    // delete renter in residence
    const renter = await this.renterModel.findById(renterId).exec();

    if (!renter) {
      throw new NotFoundException('Renter not found');
    }

    if (renter.room) {
      throw new BadRequestException(
        'Renter is in room. Please remove renter from room first.',
      );
    }


    // delete renter
    if (deleteType === 'soft') {
      return this.renterModel.findByIdAndUpdate(renterId, {
        isActive: false,
      })
    } else {
      // delete renter in residence
      await this.residenceModel
        .findOneAndUpdate(
          { _id: renter.residence },
          { $pull: { renters: renterId } },
          { new: true },
        )
        .exec();

      return this.renterModel.findByIdAndDelete(renterId).exec();
    }
  }

  async reactiveRenter(renterId: string): Promise<Renter> {
    this.validateObjectIdFormat(renterId, 'Renter');

    // delete renter in residence
    const renter = await this.renterModel.findOne({
      _id: renterId,
    }).exec();

    if (!renter) {
      throw new NotFoundException('Renter not found');
    }

    // reactive renter
    return this.renterModel.findByIdAndUpdate(renterId, {
      isActive: true,
    })
  }


  async createRoom(
    residenceId: string,
    createRoomDto: CreateRoomDto,
  ): Promise<Room> {
    this.validateObjectIdFormat(residenceId, 'Residence');

    // check residence is exist
    const residence = await this.residenceModel.findById(residenceId).exec();
    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    // check room name is exist
    const room = await this.roomModel
      .findOne({ name: createRoomDto.name, residence: residenceId })
      .exec();
    if (room) {
      throw new BadRequestException('Room name is exist');
    }

    // check is renter exist and not in other room
    if (createRoomDto.currentRenter) {
      const renter = await this.renterModel
        .findById(createRoomDto.currentRenter)
        .exec();
      if (!renter) {
        throw new NotFoundException('Renter not found');
      }
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

    // set default price rate if isUseDefaultPriceRate is true
    if (createRoomDto.isUseDefaultWaterPriceRate) {
      createRoomDto.waterPriceRate = residence.defaultWaterPriceRate;
    }
    if (createRoomDto.isUseDefaultLightPriceRate) {
      createRoomDto.lightPriceRate = residence.defaultLightPriceRate;
    }

    // create room
    const createdRoom = await new this.roomModel({
      ...createRoomDto,
      residence: residenceId,
    }).save();

    // save room to residence
    await this.residenceModel
      .findOneAndUpdate(
        { _id: residenceId },
        { $push: { rooms: createdRoom._id } },
        { new: true },
      )
      .exec();

    // save room to renter
    if (createRoomDto.currentRenter) {
      await this.renterModel
        .findOneAndUpdate(
          { _id: createRoomDto.currentRenter },
          { $set: { room: createdRoom._id } },
          { new: true },
        )
        .exec();
    }

    return createdRoom;
  }

  async findAllRoomInResidence(residenceId: string): Promise<Room[]> {
    this.validateObjectIdFormat(residenceId, 'Residence');

    const residence = await this.residenceModel
      .findById(residenceId)
      .populate('rooms')
      .exec();
    return residence.rooms;
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
    residenceId: string,
    roomId: string,
    updateRoomDto: UpdateRoomDto,
  ): Promise<Room> {
    this.validateObjectIdFormat(residenceId, 'Residence');
    this.validateObjectIdFormat(roomId, 'Room');

    // check residence is exist
    const residence = await this.residenceModel.findById(residenceId).exec();
    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    // check room is exist
    const room = await this.roomModel.findById(roomId).exec();
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // check room name is exist except this room
    const duplicateRoomName = await this.roomModel
      .findOne({ name: updateRoomDto.name, _id: { $ne: roomId } })
      .exec();
    if (duplicateRoomName) {
      throw new BadRequestException('Room name is exist');
    }

    // check if rantal update
    if (updateRoomDto.currentRenter) {
      // check is new renter exist
      const renter = await this.renterModel
        .findById(updateRoomDto.currentRenter)
        .exec();
      if (!renter) {
        throw new NotFoundException('Renter not found');
      }

      // check is new renter is active
      if (!renter.isActive) {
        throw new BadRequestException('Renter is inactive. Please reactive renter first.');
      }

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
        await this.renterModel
          .findOneAndUpdate(
            { _id: room.currentRenter },
            { $set: { room: null } },
            { new: true },
          )
          .exec();
      }

      // Update new renter set room to this room
      await this.renterModel
        .findOneAndUpdate(
          { _id: updateRoomDto.currentRenter },
          { $set: { room: roomId, updated_at: Date.now() } },
          { new: true },
        )

    } else {
      // remove room from old renter if exist
      if (room.currentRenter) {
        await this.renterModel
          .findOneAndUpdate(
            { _id: room.currentRenter },
            { $set: { room: null } },
            { new: true },
          )
          .exec();
      }
    }

    // set default price rate if isUseDefaultPriceRate is true
    if (updateRoomDto.isUseDefaultWaterPriceRate) {
      updateRoomDto.waterPriceRate = residence.defaultWaterPriceRate;
    }
    if (updateRoomDto.isUseDefaultLightPriceRate) {
      updateRoomDto.lightPriceRate = residence.defaultLightPriceRate;
    }

    // update room
    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(
        roomId,
        {
          ...updateRoomDto,
          updated_at: Date.now(),
        },
        { new: true },
      )
      .exec();

    return updatedRoom;
  }

  async deleteRoom(
    residenceId: string,
    roomId: string,
  ): Promise<Room> {
    this.validateObjectIdFormat(residenceId, 'Residence');
    this.validateObjectIdFormat(roomId, 'Room');

    // delete room in residence
    await this.residenceModel
      .findOneAndUpdate(
        { _id: residenceId },
        { $pull: { rooms: roomId } },
        { new: true },
      )
      .exec();

    // delete room
    return this.roomModel.findByIdAndDelete(roomId).exec();
  }

  // ==================== Payment ====================
  async createPayment(residenceId: string, createResidencePaymentDto: CreateResidencePaymentDto) {
    this.validateObjectIdFormat(residenceId, 'Residence');

    // check residence is exist
    const residence = await this.residenceModel.findOne({ _id: residenceId }).exec();
    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    // Add payment
    const createdPayment = await new this.paymentModel({
      ...createResidencePaymentDto,
      residence: residenceId,
    }).save();

    return createdPayment;
  }

  private validateObjectIdFormat(
    objectId: string,
    fieldName?: string,
  ): boolean {
    if (!Types.ObjectId.isValid(objectId)) {
      throw new BadRequestException(
        `${fieldName || 'Object'} id is invalid format`,
      );
    }
    return true;
  }
}
