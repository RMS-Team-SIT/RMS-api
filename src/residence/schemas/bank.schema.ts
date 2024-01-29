import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BankDocument = Bank & Document;

@Schema()
export class Bank extends Document {
    _id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, default: Date.now() })
    created_at: Date;

    @Prop({ required: true, default: Date.now() })
    updated_at: Date;
}

export const BankSchema = SchemaFactory.createForClass(Bank);
