import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Residence } from 'src/residence/schemas/residence.schema';
import { MeterRecordItem } from './meter-record-item.schema copy';

export type MeterRecordDocument = MeterRecord & Document;

@Schema()
export class MeterRecord extends Document {
    _id: string;

    @Prop({ type: Types.ObjectId, ref: 'Residence', required: true })
    residence: Residence;

    @Prop({ type: String, required: true })
    meterRecordName: string;

    @Prop({ type: [Types.ObjectId], ref: 'MeterRecord' })
    meterRecordItems: MeterRecordItem[];

    @Prop({ required: true, default: Date.now() })
    record_date: Date;

    @Prop({ required: true, default: Date.now() })
    created_at: Date;

    @Prop({ required: true, default: Date.now() })
    updated_at: Date;
}

export const MeterRecordSchema = SchemaFactory.createForClass(MeterRecord);
