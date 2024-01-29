import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Bank, BankSchema } from "./schemas/bank.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Bank.name, schema: BankSchema },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class BankModule { }
