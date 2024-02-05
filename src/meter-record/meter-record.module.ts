import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Mongoose } from "mongoose";
import { MeterRecordSchema } from "./schemas/meter-record.schema copy";
import { MeterRecordListSchema } from "./schemas/meter-record-list.schema";
import { MeterRecordService } from "./meter-record.service";
import { MeterRecordController } from "./meter-record.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'MeterRecord', schema: MeterRecordSchema },
            { name: 'MeterRecordList', schema: MeterRecordListSchema }
        ])
    ],
    controllers: [MeterRecordController],
    providers: [MeterRecordService],
    exports: [MeterRecordService]
})
export class MeterRecordModule { }