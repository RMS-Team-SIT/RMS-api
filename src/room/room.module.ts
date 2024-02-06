import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomController } from "./room.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Room, RoomSchema } from "./schemas/room.schema";
import { ResidenceModule } from "src/residence/residence.module";
import { RenterModule } from "src/renter/renter.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Room.name, schema: RoomSchema },
        ]),
        ResidenceModule,
        RenterModule,
    ],
    controllers: [RoomController],
    providers: [RoomService],
    exports: [RoomService]
})
export class RoomModule {
}