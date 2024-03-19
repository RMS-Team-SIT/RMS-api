import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { validateObjectIdFormat } from 'src/utils/mongo.utils';
import { MeterRecord } from './schemas/meter-record.schema';
import { MeterRecordItem } from './schemas/meter-record-item.schema';
import { CreateMeterRecordDto } from './dto/create-meter-record.dto';
import { ResidenceService } from 'src/residence/residence.service';
import { CreateMeterRecordItemDto } from './dto/create-meter-record-item.dto';
import { UpdateMeterRecord } from './dto/update-meter-record.dto';

@Injectable()
export class MeterRecordService {
  constructor(
    @InjectModel(MeterRecord.name)
    private readonly meterRecordModel: Model<MeterRecord>,
    private readonly residenceService: ResidenceService,
  ) {}

  async createMeterRecord(
    residenceId: string,
    createMeterRecordDto: CreateMeterRecordDto,
  ): Promise<MeterRecord> {
    // Check residence exists
    await this.residenceService.findOne(residenceId);

    // lock all meter record in residence.
    await this.lockAllMeterRecordInResidence(residenceId);

    let isFirstInitRecord = true;
    const latestRecord = await this.getLastMeterRecordByResidence(residenceId);

    if (latestRecord) {
      isFirstInitRecord = false;

      // Convert dates to Date objects for proper comparison
      const latestRecordDate = new Date(latestRecord.record_date);
      const newRecordDate = new Date(createMeterRecordDto.record_date);

      // Check if the latest meter record is newer than the new meter record
      if (latestRecordDate > newRecordDate) {
        throw new BadRequestException(
          'Cannot create meter record with date older than the latest meter record',
        );
      }
    }

    // create a new meter record
    const createdMeterRecord = await new this.meterRecordModel({
      residence: residenceId,
      ...createMeterRecordDto,
      meterRecordItems: createMeterRecordDto.meterRecordItems,
      isLocked: false,
      isFirstInitRecord,
      created_at: new Date(),
      updated_at: new Date(),
    }).save();

    // Add the created meter record to the residence
    await this.residenceService.addMeterRecordToResidence(
      residenceId,
      createdMeterRecord._id,
    );

    return createdMeterRecord;
  }

  async getMeterRecordByResidence(residenceId: string): Promise<MeterRecord[]> {
    return this.meterRecordModel
      .find({ residence: residenceId })
      .populate('meterRecordItems.room')
      .sort({ record_date: -1 })
      .exec();
  }

  async getLastMeterRecordByResidence(
    residenceId: string,
  ): Promise<MeterRecord> {
    const meterRecord = await this.meterRecordModel
      .findOne({ residence: residenceId })
      .sort({ record_date: -1 })
      .exec();
    return meterRecord;
  }

  async getMeterRecordById(meterRecordId: string): Promise<MeterRecord> {
    const meterRecord = await this.meterRecordModel
      .findById(meterRecordId)
      .populate({
        path: 'meterRecordItems.room',
        select: {
          _id: 1,
          name: 1,
        },
      })
      .exec();
    if (!meterRecord) {
      throw new BadRequestException('Meter record not found');
    }
    return meterRecord;
  }

  async getMeterRecordByIdAndResidenceId(
    meterRecordId: string,
    residenceId: string,
  ): Promise<MeterRecord> {
    validateObjectIdFormat(meterRecordId);
    validateObjectIdFormat(residenceId);

    const meterRecord = await this.meterRecordModel
      .findOne({
        _id: meterRecordId,
        residence: residenceId,
      })
      .populate({
        path: 'meterRecordItems.room',
        select: {
          _id: 1,
          name: 1,
          status: 1,
        },
      })
      .exec();

    if (!meterRecord) {
      throw new BadRequestException('Meter record not found');
    }

    return meterRecord;
  }

  async updateMeterRecord(
    residenceId: string,
    meterRecordId: string,
    updateMeterRecordDto: UpdateMeterRecord,
  ): Promise<MeterRecord> {
    // Check residence exists
    await this.residenceService.findOne(residenceId);

    // Check meter record exists
    await this.getMeterRecordByIdAndResidenceId(meterRecordId, residenceId);

    // Check is meter recordLocked
    await this.checkMeterRecordLocked(meterRecordId);

    // Update meter record
    const updatedMeterRecord = await this.meterRecordModel.findByIdAndUpdate(
      meterRecordId,
      updateMeterRecordDto,
      { new: true },
    );

    return updatedMeterRecord;
  }

  /*
    If you created bill for this meter.
    you will not able to update this meterRecord
  */
  async lockMeterRecord(meterRecordId: string): Promise<MeterRecord> {
    // Check meter record exists
    const meterRecord = await this.getMeterRecordById(meterRecordId);

    return await this.meterRecordModel
      .findByIdAndUpdate(meterRecordId, { isLocked: true }, { new: true })
      .exec();
  }

  async lockAllMeterRecordInResidence(
    residenceId: string,
  ): Promise<MeterRecord[]> {
    // Check residence exists
    await this.residenceService.findOne(residenceId);

    // Get all meter record in residence
    const meterRecords = await this.getMeterRecordByResidence(residenceId);

    // Lock all meter record
    const updatedMeterRecords = await Promise.all(
      meterRecords.map(async (meterRecord) => {
        if (!meterRecord.isLocked) {
          return await this.meterRecordModel.findByIdAndUpdate(
            meterRecord._id,
            { isLocked: true },
            { new: true },
          );
        }
      }),
    );

    return updatedMeterRecords;
  }

  async unlockMeterRecord(meterRecordId: string): Promise<MeterRecord> {
    // Check meter record exists
    const meterRecord = await this.getMeterRecordById(meterRecordId);
    if (!meterRecord.isLocked) {
      throw new BadRequestException('Meter record already unlocked');
    }

    return await this.meterRecordModel
      .findByIdAndUpdate(meterRecordId, { isLocked: false }, { new: true })
      .exec();
  }

  async checkMeterRecordLocked(meterRecordId: string): Promise<void> {
    // Check meter record exists
    const meterRecord = await this.getMeterRecordById(meterRecordId);
    if (meterRecord.isLocked) {
      throw new BadRequestException('Meter record is locked');
    }
  }

  async setBillGenerated(meterRecordId: string): Promise<MeterRecord> {
    // Check meter record exists
    const meterRecord = await this.getMeterRecordById(meterRecordId);
    // if (meterRecord.isBillGenerated) {
    //   throw new BadRequestException('Bill already generated');
    // }

    return await this.meterRecordModel
      .findByIdAndUpdate(
        meterRecordId,
        { isBillGenerated: true },
        { new: true },
      )
      .exec();
  }

  async addBillToMeterRecord(meterRecordId: string, billId: string) {
    // Check meter record exists
    await this.getMeterRecordById(meterRecordId);

    const updatedMeterRecord = this.meterRecordModel
      .findOneAndUpdate(
        {
          _id: meterRecordId,
        },
        {
          $set: {
            bill: billId,
          },
        },
      )
      .exec();

    return updatedMeterRecord;
  }
}
