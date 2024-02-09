import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { validateObjectIdFormat } from "src/utils/mongo.utils";
import { MeterRecord } from "./schemas/meter-record.schema";
import { MeterRecordItem } from "./schemas/meter-record-item.schema";
import { CreateMeterRecordDto } from "./dto/create-meter-record.dto";
import { ResidenceService } from "src/residence/residence.service";
import { CreateMeterRecordItemDto } from "./dto/create-meter-record-item.dto";
import { UpdateMeterRecord } from "./dto/update-meter-record.dto";

@Injectable()
export class MeterRecordService {
    constructor(
        @InjectModel(MeterRecord.name)
        private readonly meterRecordModel: Model<MeterRecord>,
        @InjectModel(MeterRecordItem.name)
        private readonly meterRecordItemModel: Model<MeterRecordItem>,
        private readonly residenceService: ResidenceService,
    ) { }

    async createMeterRecord(
        residenceId: string,
        createMeterRecordDto: CreateMeterRecordDto
    ): Promise<MeterRecord> {

        // Check residence exists
        await this.residenceService.findOne(residenceId);

        // create a new meter record
        const createdMeterRecord = await new this.meterRecordModel({
            residence: residenceId,
            ...createMeterRecordDto,
            meterRecordItems: createMeterRecordDto.meterRecordItems,
        }).save();

        // Add the created meter record to the residence
        await this.residenceService.addMeterRecordToResidence(
            residenceId,
            createdMeterRecord._id
        );

        return createdMeterRecord;
    }

    async getMeterRecordByResidence(
        residenceId: string
    ): Promise<MeterRecord[]> {
        return this.meterRecordModel.find({ residence: residenceId }).exec();
    }

    async getMeterRecordById(meterRecordId: string): Promise<MeterRecord> {
        const meterRecord = this.meterRecordModel
            .findById(meterRecordId)
            .populate('rooms')
            .exec();
        if (!meterRecord) {
            throw new BadRequestException('Meter record not found');
        }
        return meterRecord;
    }

    async getMeterRecordByIdAndResidenceId(meterRecordId: string, residenceId: string): Promise<MeterRecord> {
        const meterRecord = this.meterRecordModel
            .findOne({
                _id: meterRecordId,
                residence: residenceId
            })
            .populate({
                path: 'meterRecordItems.room',
                select: {
                    _id: 1,
                    name: 1,
                }
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
        updateMeterRecordDto: UpdateMeterRecord
    ): Promise<MeterRecord> {

        // Check residence exists
        await this.residenceService.findOne(residenceId);

        // Check meter record exists
        await this.getMeterRecordByIdAndResidenceId(meterRecordId, residenceId);

        // Update meter record
        const updatedMeterRecord = await this.meterRecordModel.findByIdAndUpdate(
            meterRecordId,
            updateMeterRecordDto,
            { new: true }
        );

        return updatedMeterRecord;

    }

}