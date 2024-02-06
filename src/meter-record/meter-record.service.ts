import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { validateObjectIdFormat } from "src/utils/mongo.utils";
import { MeterRecord } from "./schemas/meter-record.schema";
import { MeterRecordItem } from "./schemas/meter-record-item.schema copy";
import { CreateMeterRecordDto } from "./dto/create-meter-record.dto";
import { ResidenceService } from "src/residence/residence.service";
import { CreateMeterRecordItemDto } from "./dto/create-meter-record-item.dto";

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

        const createdMeterRecord = await new this.meterRecordModel({
            residence: residenceId,
            ...createMeterRecordDto
        }).save();

        // Add the created meter record to the residence
        await this.residenceService.addMeterRecordToResidence(
            residenceId,
            createdMeterRecord._id
        );

        return createdMeterRecord;
    }

    async getMeterRecord(): Promise<MeterRecord[]> {
        return this.meterRecordModel.find().exec();
    }

    async getMeterRecordByResidence(
        residenceId: string
    ): Promise<MeterRecord[]> {
        return this.meterRecordModel.find({ residence: residenceId }).exec();
    }

    async getMeterRecordById(meterRecordId: string): Promise<MeterRecord> {
        return this.meterRecordModel.findById(meterRecordId).exec();
    }

    // async addRecordToMeterRecord(
    //     meterRecordId: string,
    //     meterRecordItem: CreateMeterRecordItemDto
    // ) {
    //     // check Id is valid
    //     validateObjectIdFormat(meterRecordId)

    //     // find the meter record  exists
    //     const meterRecordExists = await this.meterRecordModel.findById(meterRecordId).exec();
    //     if (!meterRecordExists) {
    //         throw new BadRequestException('Meter record  not found');
    //     }


    //     // create a new meter record
    //     const createdMeterRecord = await new this.meterRecordModel({
    //         ...meterRecordItem,
    //         meterRecord: meterRecordId
    //     }).save();

    //     // add the created meter record to the meter record 
    //     const meterRecord = await this.meterRecordModel.findByIdAndUpdate(meterRecordId, {
    //         $push: { meterRecords: createdMeterRecord._id }
    //     }).exec();

    //     return meterRecord;
    // }

    // updateMeterRecord() { }

    // deleteMeterRecord() { }

    // createMeterRecord() { }

    // getMeterRecord() { }

    // getMeterRecordById() { }

    // updateMeterRecord() { }

    // deleteMeterRecord() { }
}