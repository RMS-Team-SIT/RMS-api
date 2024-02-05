import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Residence } from 'src/residence/schemas/residence.schema';
import { MeterRecord } from './meter-record.schema copy';

export type MeterRecordListDocument = MeterRecordList & Document;

@Schema()
export class MeterRecordList extends Document {
    _id: string;

    @Prop({ type: Types.ObjectId, ref: 'Residence', required: true })
    residence: Residence;

    @Prop({ type: String, required: true })
    meterRecordListName: string;

    @Prop({ type: [Types.ObjectId], ref: 'MeterRecord' })
    meterRecord: MeterRecord[];

    @Prop({ required: true, default: Date.now() })
    record_date: Date;

    @Prop({ required: true, default: Date.now() })
    created_at: Date;

    @Prop({ required: true, default: Date.now() })
    updated_at: Date;
}

export const MeterRecordListSchema = SchemaFactory.createForClass(MeterRecordList);
