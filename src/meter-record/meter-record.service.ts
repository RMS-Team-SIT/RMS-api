import { Injectable } from "@nestjs/common";
import { CreateMeterRecordListDto } from "./dto/create-meter-record-list.dto";
import { InjectModel } from "@nestjs/mongoose";
import { MeterRecordList } from "./schemas/meter-record-list.schema";
import { Model } from "mongoose";
import { MeterRecord } from "./schemas/meter-record.schema copy";

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

    // getMeterRecordList() { }

    // getMeterRecordListById() { }

    // updateMeterRecordList() { }

    // deleteMeterRecordList() { }

    // createMeterRecord() { }

    // getMeterRecord() { }

    // getMeterRecordById() { }

    // updateMeterRecord() { }

    // deleteMeterRecord() { }
}