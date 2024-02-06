import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Room } from 'src/room/schemas/room.schema';
import { MeterRecord } from './meter-record.schema';

export type MeterRecordItemDocument = MeterRecordItem & Document;

@Schema()
export class MeterRecordItem extends Document {
    _id: string;

    @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
    room: Room;

    @Prop({ type: Types.ObjectId, ref: 'MeterRecord', required: true })
    meterRecord: MeterRecord;

    // water meter
    @Prop({ type: Number, required: true })
    oldWaterMeter: number;

    @Prop({ type: Number, required: true })
    newWaterMeter: number;

    // electric meter
    @Prop({ type: Number, required: true })
    oldElectricMeter: number;

    @Prop({ type: Number, required: true })
    newElectricMeter: number;

    @Prop({ required: true, default: Date.now() })
    created_at: Date;

    @Prop({ required: true, default: Date.now() })
    updated_at: Date;
}

export const MeterRecordItemSchema = SchemaFactory.createForClass(MeterRecordItem);
