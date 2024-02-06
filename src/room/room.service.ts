import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Room } from "./schemas/room.schema";
import { Model } from "mongoose";
import { CreateRoomDto } from "./dto/create-room.dto";
import { ResidenceService } from "src/residence/residence.service";
import { validateObjectIdFormat } from "src/utils/mongo.utils";
import { UpdateRoomDto } from "./dto/update-room.dto";

@Injectable()
export class RoomService {
    constructor(
        @InjectModel(Room.name)
        private roomModel: Model<Room>,
        private readonly residenceService: ResidenceService,
    ) { }

    private async checkRoomNameExist(
        name: string,
        residenceId: string,
        roomId?: string
    ): Promise<void> {

        const filter = { name, residence: residenceId };

        if (roomId) {
            filter['_id'] = { $ne: roomId };
        }

        const room = await this.roomModel.findOne(filter).exec();

        if (room) {
            throw new BadRequestException('Room name is exist');
        }
    }

    private async checkRoomExist(roomId: string): Promise<void> {
        const room = await this.roomModel.findById(roomId).exec();
        if (!room) {
            throw new NotFoundException('Room not found');
        }
    }

    async createRoom(
        residenceId: string,
        createRoomDto: CreateRoomDto,
    ): Promise<Room> {

        // check residence is exist
        const residence = await this.residenceService.findOne(residenceId);

        // check room name is exist
        await this.checkRoomNameExist(createRoomDto.name, residenceId);

        // check is renter exist and not in other room
        // if (createRoomDto.currentRenter) {
        //     const renter = await this.renterModel
        //         .findById(createRoomDto.currentRenter)
        //         .exec();
        //     if (!renter) {
        //         throw new NotFoundException('Renter not found');
        //     }
        //     const room = await this.roomModel
        //         .findOne({
        //             currentRenter: createRoomDto.currentRenter,
        //             residence: residenceId,
        //         })
        //         .exec();
        //     if (room) {
        //         throw new BadRequestException('Renter is exist in other room');
        //     }
        // }

        // Set the default price rate if isUseDefaultPriceRate is true.
        if (createRoomDto.isUseDefaultWaterPriceRate) {
            createRoomDto.waterPriceRate = residence.defaultWaterPriceRate;
        }
        if (createRoomDto.isUseDefaultLightPriceRate) {
            createRoomDto.lightPriceRate = residence.defaultLightPriceRate;
        }

        // Create room
        const createdRoom = await new this.roomModel({
            ...createRoomDto,
            residence: residenceId,
        }).save();

        // Save room to residence
        await this.residenceService.addRoomToResidence(residenceId, createdRoom._id);

        // Save room to renter
        // if (createRoomDto.currentRenter) {
        //     await this.renterModel
        //         .findOneAndUpdate(
        //             { _id: createRoomDto.currentRenter },
        //             { $set: { room: createdRoom._id } },
        //             { new: true },
        //         )
        //         .exec();
        // }

        return createdRoom;
    }

    async findAllRoomInResidence(residenceId: string): Promise<Room[]> {
        validateObjectIdFormat(residenceId, 'Residence');

        return this.roomModel.find({ residence: residenceId }).exec();
    }

    async findOneRoom(residenceId: string, roomId: string): Promise<Room> {
        validateObjectIdFormat(roomId, 'Room');
        validateObjectIdFormat(residenceId, 'Room');

        const room = await this.roomModel.findOne({ _id: roomId, residence: residenceId }).exec();

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        return room;
    }

    async updateRoom(
        residenceId: string,
        roomId: string,
        updateRoomDto: UpdateRoomDto,
    ): Promise<Room> {
        validateObjectIdFormat(residenceId, 'Residence');
        validateObjectIdFormat(roomId, 'Room');

        // check room is exist
        await this.checkRoomExist(roomId);

        // check residence is exist
        const residence = await this.residenceService.findOne(residenceId);

        // check room name is exist except this room
        await this.checkRoomNameExist(updateRoomDto.name, residenceId, roomId);

        // check if rantal update
        // if (updateRoomDto.currentRenter) {
        //     // check is new renter exist
        //     const renter = await this.renterModel
        //         .findById(updateRoomDto.currentRenter)
        //         .exec();
        //     if (!renter) {
        //         throw new NotFoundException('Renter not found');
        //     }

        //     // check is new renter is active
        //     if (!renter.isActive) {
        //         throw new BadRequestException('Renter is inactive. Please reactive renter first.');
        //     }

        //     // check: Is new renter not in other room
        //     const renterRoom = await this.roomModel
        //         .findOne({
        //             currentRenter: updateRoomDto.currentRenter,
        //             _id: { $ne: roomId },
        //         })
        //         .exec();
        //     if (renterRoom) {
        //         throw new BadRequestException('Renter is exist in other room');
        //     }

        //     // Remove room from old renter if exist
        //     if (room.currentRenter) {
        //         await this.renterModel
        //             .findOneAndUpdate(
        //                 { _id: room.currentRenter },
        //                 { $set: { room: null } },
        //                 { new: true },
        //             )
        //             .exec();
        //     }

        // Update new renter set room to this room
        // await this.renterModel
        //     .findOneAndUpdate(
        //         { _id: updateRoomDto.currentRenter },
        //         { $set: { room: roomId, updated_at: Date.now() } },
        //         { new: true },
        //     )

        // } else {
        //     // remove room from old renter if exist
        //     if (room.currentRenter) {
        //         await this.renterModel
        //             .findOneAndUpdate(
        //                 { _id: room.currentRenter },
        //                 { $set: { room: null } },
        //                 { new: true },
        //             )
        //             .exec();
        //     }
        // }

        // Set the default price rate if isUseDefaultPriceRate is true.
        if (updateRoomDto.isUseDefaultWaterPriceRate) {
            updateRoomDto.waterPriceRate = residence.defaultWaterPriceRate;
        }
        if (updateRoomDto.isUseDefaultLightPriceRate) {
            updateRoomDto.lightPriceRate = residence.defaultLightPriceRate;
        }

        // update room
        return await this.roomModel
            .findByIdAndUpdate(
                roomId,
                {
                    ...updateRoomDto,
                    updated_at: Date.now(),
                },
                { new: true },
            )
            .exec();
    }

    async deleteRoom(
        residenceId: string,
        roomId: string,
    ): Promise<Room> {
        validateObjectIdFormat(residenceId, 'Residence');
        validateObjectIdFormat(roomId, 'Room');

        // Delete room in residence
        await this.residenceService.removeRoomFromResidence(residenceId, roomId);

        // Delete room
        return this.roomModel.findByIdAndDelete(roomId).exec();
    }
}