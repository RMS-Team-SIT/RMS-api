import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { validateObjectIdFormat } from "src/utils/mongo.utils";
import { MeterRecord } from "./schemas/meter-record.schema";
import { MeterRecordItem } from "./schemas/meter-record-item.schema";
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

        // create a new meter record
        const createdMeterRecord = await new this.meterRecordModel({
            residence: residenceId,
            ...createMeterRecordDto,
            meterRecordItems: createMeterRecordDto.meterRecordItems,
            meterRecordShortname: createMeterRecordDto.record_date
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
        return this.meterRecordModel.findById(meterRecordId).exec();
    }

}