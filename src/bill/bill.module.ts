import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BillRoom, BillRoomSchema } from "./schemas/bill-room.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: BillRoom.name, schema: BillRoomSchema }
        ])
    ],
    providers: [],
    controllers: [],
    exports: [],
})
export class BillModule { }