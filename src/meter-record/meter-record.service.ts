import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateMeterRecordListDto } from "./dto/create-meter-record-list.dto";
import { InjectModel } from "@nestjs/mongoose";
import { MeterRecordList } from "./schemas/meter-record-list.schema";
import { Model } from "mongoose";
import { MeterRecord } from "./schemas/meter-record.schema copy";
import { CreateMeterRecordDto } from "./dto/create-meter-record.dto";
import { validateObjectIdFormat } from "src/utils/mongo.utils";

@Injectable()
export class MeterRecordService {
    constructor(
        @InjectModel(MeterRecordList.name)
        private readonly meterRecordListModel: Model<MeterRecordList>,
        @InjectModel(MeterRecord.name)
        private readonly meterRecordModel: Model<MeterRecord>,
    ) { }

    async createMeterRecordList(
        residenceId: string,
        createMeterRecordListDto: CreateMeterRecordListDto
    ): Promise<MeterRecordList> {

        const createdMeterRecordList = new this.meterRecordListModel({
            residence: residenceId,
            ...createMeterRecordListDto
        });

        return createdMeterRecordList.save();
    }

    async getMeterRecordList(): Promise<MeterRecordList[]> {
        return this.meterRecordListModel.find().exec();
    }

    async getMeterRecordListByResidence(
        residenceId: string
    ): Promise<MeterRecordList[]> {
        return this.meterRecordListModel.find({ residence: residenceId }).exec();
    }

    async getMeterRecordListById(meterRecordListId: string): Promise<MeterRecordList> {
        return this.meterRecordListModel.findById(meterRecordListId).exec();
    }

    async addRecordToMeterRecordList(
        meterRecordListId: string,
        meterRecord: CreateMeterRecordDto
    ) {
        // check Id is valid
        validateObjectIdFormat(meterRecordListId)

        // find the meter record list exists
        const meterRecordListExists = await this.meterRecordListModel.findById(meterRecordListId).exec();
        if (!meterRecordListExists) {
            throw new BadRequestException('Meter record list not found');
        }


        // create a new meter record
        const createdMeterRecord = await new this.meterRecordModel({
            ...meterRecord,
            meterRecordList: meterRecordListId
        }).save();

        // add the created meter record to the meter record list
        const meterRecordList = await this.meterRecordListModel.findByIdAndUpdate(meterRecordListId, {
            $push: { meterRecords: createdMeterRecord._id }
        }).exec();
        
        return meterRecordList;
    }

    // updateMeterRecordList() { }

    // deleteMeterRecordList() { }

    // createMeterRecord() { }

    // getMeterRecord() { }

    // getMeterRecordById() { }

    // updateMeterRecord() { }

    // deleteMeterRecord() { }
}