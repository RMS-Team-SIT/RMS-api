import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Renter } from '../../renter/schemas/renter.schema';

export type BillRoomDocument = BillRoom & Document;
@Schema()
export class BillRoom extends Document {
    _id: string;

    // Water
    @Prop({ required: true })
    waterPriceRate: number;

    @Prop({ required: true })
    waterMeter: number;

    @Prop({ required: true })
    waterTotalPrice: number;

    // Light/Electric are the same
    @Prop({ required: true })
    lightPriceRate: number;

    @Prop({ required: true })
    electricMeter: number;

    @Prop({ required: true })
    lightTotalPrice: number;


    @Prop({ required: true })
    totalPrice: number;

    @Prop({ default: null })
    paidEvidenceImage: string;

    @Prop({ default: false, required: true })
    isPaid: boolean;

    @Prop({ default: null, required: true })
    paidDate: Date;

    @Prop({ required: true, default: Date.now() })
    created_at: Date;

    @Prop({ required: true, default: Date.now() })
    updated_at: Date;
}

export const BillRoomSchema = SchemaFactory.createForClass(BillRoom);
