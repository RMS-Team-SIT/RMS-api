import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BillRoom, BillRoomSchema } from "./schemas/bill-room.schema";
import { BillService } from "./bill.service";
import { BillController } from "./bill.controller";
import { Bill, BillSchema } from "./schemas/bill.schema";
import { ResidenceModule } from "src/residence/residence.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: BillRoom.name, schema: BillRoomSchema },
            { name: Bill.name, schema: BillSchema },
        ]),
        ResidenceModule,
    ],
    providers: [BillService],
    controllers: [BillController],
    exports: [BillService],
})
export class BillModule { }