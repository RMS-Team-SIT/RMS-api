import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Mongoose } from "mongoose";
import { MeterRecordService } from "./meter-record.service";
import { MeterRecordController } from "./meter-record.controller";
import { MeterRecordSchema } from "./schemas/meter-record.schema";
import { MeterRecordItemSchema } from "./schemas/meter-record-item.schema copy";
import { ResidenceModule } from "src/residence/residence.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'MeterRecord', schema: MeterRecordSchema },
            { name: 'MeterRecordItem', schema: MeterRecordItemSchema }
        ]),
        ResidenceModule,
    ],
    controllers: [MeterRecordController],
    providers: [MeterRecordService],
    exports: [MeterRecordService]
})
export class MeterRecordModule { }