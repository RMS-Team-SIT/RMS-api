import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Room } from 'src/residence/schemas/room.schema';
import { MeterRecordList } from './meter-record-list.schema';

export type MeterRecordDocument = MeterRecord & Document;

@Schema()
export class MeterRecord extends Document {
    _id: string;

    @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
    room: Room;

    @Prop({ type: Types.ObjectId, ref: 'MeterRecordList', required: true })
    meterRecordList: MeterRecordList;

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

export const MeterRecordSchema = SchemaFactory.createForClass(MeterRecord);
