import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Residence } from "./residence.schema";
import { Bank } from "./bank.schema";

export type PaymentDocument = Payment & Document;

export enum PaymentType {
    BANK_TRANSFER = 'bank_transfer',
    CASH = 'cash',
    PROMPTPAY = 'promptpay',
    STRIPE = 'stripe',
}

@Schema()
export class Payment extends Document {
    _id: string;

    @Prop({ type: Types.ObjectId, ref: 'Residence', required: true })
    residence: Residence;

    @Prop({ type: Types.ObjectId, ref: 'Residence', required: false })
    bank: Bank;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, default: PaymentType.BANK_TRANSFER })
    type: PaymentType;

    @Prop({ required: false })
    account_number: string;

    @Prop({ required: false })
    promptpay_number: string;

    @Prop({ required: true, default: Date.now() })
    created_at: Date;

    @Prop({ required: true, default: Date.now() })
    updated_at: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
