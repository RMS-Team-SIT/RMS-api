import {
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
import { ResponseResidenceOverallStatsDto } from './dtos/response-residence-overallstats.dto';
import { CreateResidenceFullyDto } from './dtos/create-residence-fully.dto';
import { Fee } from 'src/fees/schemas/fee.schema';
import { Payment } from 'src/payment/schemas/payment.schema';
import { RoomType } from 'src/room-type/schemas/room-type.schema';
import { Room } from 'src/room/schemas/room.schema';
import { NotificationService } from 'src/notification/notification.service';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { UpdateUtilityDto } from './dtos/update-utility.dto';

@Injectable()
export class ResidenceService {
  constructor(
    @InjectModel(Residence.name)
    private readonly residenceModel: Model<Residence>,
    @InjectModel(Fee.name)
    private readonly feeModel: Model<Fee>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
    @InjectModel(RoomType.name)
    private readonly roomTypeModel: Model<RoomType>,
    @InjectModel(Room.name)
    private readonly roomModel: Model<Room>,
    private readonly notificationService: NotificationService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) { }

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

  async overAllStats(): Promise<object> {
    const totalApprovedResidences = await this.residenceModel
      .countDocuments({ isApproved: true })
      .exec();
    const totalPendingResidences = await this.residenceModel
      .countDocuments({ isApproved: false })
      .exec();

    return {
      totalApprovedResidences,
      totalPendingResidences,
    };
  }

  async findPendingResidence(): Promise<Residence[]> {
    return this.residenceModel
      .find({ isApproved: false })
      .populate('owner')
      .populate('facilities')
      .populate('fees')
      .populate('payments')
      .populate('roomTypes')
      .populate('rooms')
      .populate({
        path: 'rooms',
        populate: { path: 'type' },
      })
      .populate('renters')
      .exec();
  }

  async approveResidence(residenceId: string): Promise<Residence> {
    validateObjectIdFormat(residenceId, 'Residence');

    const residence = await this.residenceModel
      .findByIdAndUpdate(
        residenceId,
        {
          isApproved: true,
          updated_at: Date.now(),
        },
        { new: true },
      )
      .populate('owner')
      .exec();
    const userNotification = {
      tos: [residence.owner._id.toString()],
      toEmails: [residence.owner.email],
      title: 'หอพักของคุณได้รับการอนุมัติแล้ว ',
      content: `หอพัก ${residence.name} ของคุณ ได้รับการอนุมัติแล้ว คุณสามารถเริ่มใช้งานระบบจัดการหอพักได้แล้ว`,
      isSentEmail: true,
      isRead: false,
    };
    const createdNotification =
      await this.notificationService.create(userNotification);
    await this.userService.addNotificationToUser(
      residence.owner._id.toString(),
      createdNotification._id.toString(),
    );
    return residence;
  }

  // Residence
  async create(
    userId: string,
    createResidenceFullyDto: CreateResidenceFullyDto,
  ): Promise<Residence> {
    // Create Residence
    const {
      name,
      description,
      address,
      images,
      defaultWaterPriceRate,
      defaultElectricPriceRate,
      contact,
      facilities,
      fees,
      residenceBusinessLicense,
      payments,
      roomTypes,
      rooms,
      paymentNotes,
      taxId,
    } = createResidenceFullyDto;

    const residenceModel = new this.residenceModel({
      owner: userId,
      name,
      description,
      address,
      images,
      defaultWaterPriceRate,
      defaultElectricPriceRate,
      contact,
      facilities,
      residenceBusinessLicense,
      isApproved: false,
      paymentNotes,
      taxId,
    });
    const createdResidence = await residenceModel.save();

    const residenceId = createdResidence._id.toString();

    // Create fees
    const tempFees = fees.map((dto) => {
      return new this.feeModel({
        residence: residenceId,
        ...dto,
      });
    });
    const createdFees = await this.feeModel.insertMany(tempFees);

    // Create Payments
    const tempPayments = payments.map((dto) => {
      return new this.paymentModel({
        residence: residenceId,
        bank: dto.bankId,
        ...dto,
      });
    });
    const createdPayments = await this.paymentModel.insertMany(tempPayments);

    // Create RoomTypes
    const tempRoomTypes = roomTypes.map((dto) => {
      return new this.roomTypeModel({
        residence: residenceId,
        ...dto,
      });
    });
    const createdRoomTypes = await this.roomTypeModel.insertMany(tempRoomTypes);

    // Create Rooms
    const tempRooms = rooms.map((dto) => {
      return new this.roomModel({
        residence: residenceId,
        ...dto,
      });
    });
    const createdRooms = await this.roomModel.insertMany(tempRooms);

    // Add fees, payments, roomtypes, rooms  to residence
    await this.residenceModel
      .findOneAndUpdate(
        { _id: residenceId },
        {
          fees: createdFees.map((i) => i._id.toString()),
          payments: createdPayments.map((i) => i._id.toString()),
          roomTypes: createdRoomTypes.map((i) => i._id.toString()),
          rooms: createdRooms.map((i) => i._id.toString()),
        },
        { new: true },
      )
      .exec();

    // send notification to admins
    const admins = await this.userService.findAdmin();
    const adminNotification = {
      tos: admins.map(admin => admin._id.toString()),
      toEmails: admins.map(admin => admin.email),
      title: 'มีการลงทะเบียนหอพักใหม่',
      content: `มีการลงทะเบียนหอพักใหม่ชื่อ ${name} โปรดตรวจสอบและอนุมัติหอพักใหม่นี้`,
      isSentEmail: true,
      isRead: false,
    };

    const createdNotification = await this.notificationService.create(adminNotification);

    await this.userService.addNotificationToUsers(
      admins.map(admin => admin._id.toString()),
      createdNotification._id.toString(),
    );

    return createdResidence;
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
          firstname: 1,
          lastname: 1,
          email: 1,
          phone: 1,
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
        options: { sort: { floor: 1, name: 1 } },
      })
      .populate({
        path: 'rooms',
        populate: { path: 'type' },
      })
      .populate('facilities', { __v: 0, residence: 0 })
      .populate('fees', { __v: 0, residence: 0 })
      .populate('roomTypes', { __v: 0, residence: 0 })
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
      .populate('bills', { __v: 0, residence: 0 })
      .populate({
        path: 'bills',
        populate: {
          path: 'billRooms',
          select: { __v: 0, bill: 0 },
        },
      })
      .populate({
        path: 'bills',
        populate: {
          path: 'meterRecord',
          select: { record_date: 1 },
        },
      })
      .sort({ 'meterRecord.record_date': -1 })
      .exec();

    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    return residence;
  }

  async findOnePublic(residenceId: string): Promise<Residence> {
    validateObjectIdFormat(residenceId, 'Residence');

    const residence = await this.residenceModel
      .findById(residenceId)
      .select({
        name: 1,
        _id: 1,
        images: 1,
      })
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

  async updateUtility(id: string, dto: UpdateUtilityDto): Promise<Residence> {
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

  async addRoomTypesToResidence(
    residenceId: string,
    roomTypeIds: string[],
  ) {
    return this.residenceModel
      .findOneAndUpdate(
        { _id: residenceId },
        { $push: { roomTypes: [...roomTypeIds] } },
        { new: true },
      )
      .exec();
  }

  async addFeesToResidence(residenceId: string, feeIds: string[]): Promise<Residence> {
    validateObjectIdFormat(residenceId, 'Residence');

    return this.residenceModel
      .findOneAndUpdate(
        { _id: residenceId },
        { $push: { fees: [...feeIds] } },
        { new: true },
      )
      .exec();
  }

  async removeFeeFromResidence(residenceId: string, feeId: string): Promise<Residence> {
    validateObjectIdFormat(residenceId, 'Residence');
    validateObjectIdFormat(feeId, 'Fee');

    return this.residenceModel
      .findOneAndUpdate(
        { _id: residenceId },
        { $pull: { fees: feeId } },
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

  async addBillToResidence(
    residenceId: string,
    billId: string,
  ): Promise<Residence> {
    validateObjectIdFormat(residenceId, 'Residence');
    validateObjectIdFormat(billId, 'Bill');

    return this.residenceModel
      .findOneAndUpdate(
        { _id: residenceId },
        { $push: { bills: billId } },
        { new: true },
      )
      .exec();
  }

  // Admin only
  async findAll(): Promise<Residence[]> {
    return this.residenceModel
      .find()
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

  // async changeApproveResidenceStatus(
  //   residenceId: string,
  //   approveStatus: boolean,
  // ): Promise<Residence> {
  //   validateObjectIdFormat(residenceId, 'Residence');

  //   return this.residenceModel
  //     .findByIdAndUpdate(
  //       residenceId,
  //       {
  //         isApproved: approveStatus,
  //         updated_at: Date.now(),
  //       },
  //       { new: true },
  //     )
  //     .exec();
  // }
}
