import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Bill } from "./schemas/bill.schema";
import { Model } from "mongoose";
import { CreateBillDto } from "src/residence/dtos/create-bill.dto";
import { BillRoom } from "./schemas/bill-room.schema";

@Injectable()
export class BillService {
    constructor(
        @InjectModel(Bill.name)
        private readonly billModel: Model<Bill>,
        @InjectModel(BillRoom.name)
        private readonly billRoomModel: Model<BillRoom>

    ) { }

    async createBill(
        residenceId: string,
        createBillDto: CreateBillDto
    ) {

    }
}