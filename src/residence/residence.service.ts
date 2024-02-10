import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Residence } from './schemas/residence.schema';
import { CreateResidenceDto } from './dtos/create-residence.dto';
import { UpdateResidenceDto } from './dtos/update-residence.dto';
import { validateObjectIdFormat } from 'src/utils/mongo.utils';

@Injectable()
export class ResidenceService {
  constructor(
    @InjectModel(Residence.name)
    private readonly residenceModel: Model<Residence>,
  ) {}

  async checkOwnerPermission(
    userId: string,
    residenceId: string,
  ): Promise<void> {
    const residence = await this.residenceModel.findById(residenceId).exec();
    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    if (residence.owner.toString() != userId.toString()) {
      throw new UnauthorizedException('You are not owner of this residence');
    }
  }

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
        __v: 0,
      })
      .populate({
        path: 'owner',
        select: {
          _id: 1,
        },
      })
      .populate('renters')
      .populate('rooms')
      .populate({
        path: 'rooms',
        populate: { path: 'currentRenter' },
      })
      .exec();
  }

  async findOne(residenceId: string): Promise<Residence> {
    validateObjectIdFormat(residenceId, 'Residence');

    const residence = await this.residenceModel
      .findById(residenceId)
      .select({
        __v: 0,
        created_at: 0,
        updated_at: 0,
      })
      .populate({
        path: 'owner',
        select: {
          _id: 1,
        },
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
      .populate('payments', { __v: 0, residence: 0 })
      .populate({
        path: 'payments',
        populate: {
          path: 'bank',
          select: { _id: 1, thai_name: 1, bank: 1, color: 1, nice_name: 1 },
        },
      })
      .populate('meterRecord', { __v: 0, residence: 0 })
      .populate({
        path: 'meterRecord',
        populate: {
          path: 'meterRecordItems',
          select: { __v: 0, meterRecord: 0 },
        },
      })
      .sort({ 'meterRecord.record_date': -1 })
      .exec();

    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    return residence;
  }

  async update(id: string, dto: UpdateResidenceDto): Promise<Residence> {
    validateObjectIdFormat(id, 'Residence');

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

  async addRenterToResidence(
    residenceId: string,
    renterId: string,
  ): Promise<Residence> {
    validateObjectIdFormat(residenceId, 'Residence');
    validateObjectIdFormat(renterId, 'Renter');

    return this.residenceModel
      .findOneAndUpdate(
        { _id: residenceId },
        { $push: { renters: renterId } },
        { new: true },
      )
      .exec();
  }

  async removeRenterFromResidence(
    residenceId: string,
    renterId: string,
  ): Promise<Residence> {
    validateObjectIdFormat(residenceId, 'Residence');
    validateObjectIdFormat(renterId, 'Renter');

    return this.residenceModel
      .findOneAndUpdate(
        { _id: residenceId },
        { $pull: { renters: renterId } },
        { new: true },
      )
      .exec();
  }

  async addRoomToResidence(
    residenceId: string,
    roomId: string,
  ): Promise<Residence> {
    validateObjectIdFormat(residenceId, 'Residence');
    validateObjectIdFormat(roomId, 'Room');

    return this.residenceModel
      .findOneAndUpdate(
        { _id: residenceId },
        { $push: { rooms: roomId } },
        { new: true },
      )
      .exec();
  }

  async addRoomsToResidence(
    residenceId: string,
    roomIds: string[],
  ): Promise<Residence> {
    return this.residenceModel
      .findOneAndUpdate(
        { _id: residenceId },
        { $push: { rooms: [...roomIds] } },
        { new: true },
      )
      .exec();
  }

  async removeRoomFromResidence(
    residenceId: string,
    roomId: string,
  ): Promise<Residence> {
    validateObjectIdFormat(residenceId, 'Residence');
    validateObjectIdFormat(roomId, 'Room');

    return this.residenceModel
      .findOneAndUpdate(
        { _id: residenceId },
        { $pull: { rooms: roomId } },
        { new: true },
      )
      .exec();
  }

  async addPaymentToResidence(
    residenceId: string,
    paymentId: string,
  ): Promise<Residence> {
    validateObjectIdFormat(residenceId, 'Residence');
    validateObjectIdFormat(paymentId, 'Payment');

    return this.residenceModel
      .findOneAndUpdate(
        { _id: residenceId },
        { $push: { payments: paymentId } },
        { new: true },
      )
      .exec();
  }

  async addMeterRecordToResidence(
    residenceId: string,
    meterRecordId: string,
  ): Promise<Residence> {
    validateObjectIdFormat(residenceId, 'Residence');
    validateObjectIdFormat(meterRecordId, 'MeterRecord');

    return this.residenceModel
      .findOneAndUpdate(
        { _id: residenceId },
        { $push: { meterRecord: meterRecordId } },
        { new: true },
      )
      .exec();
  }
}
