import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  MeterRecordItem,
  MeterRecordItemSchema,
} from './meter-record-item.schema';
import { Residence } from 'src/residence/schemas/residence.schema';
import { Bill } from 'src/bill/schemas/bill.schema';

export type MeterRecordDocument = MeterRecord & Document;

@Schema()
export class MeterRecord extends Document {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'Residence', required: true })
  residence: Residence;

  @Prop({ type: Types.ObjectId, ref: 'Bill', required: true })
  bill: Bill;

  @Prop({ required: true, default: Date.now() })
  record_date: Date;

  @Prop({ type: [MeterRecordItemSchema], default: [] })
  meterRecordItems: MeterRecordItem[];

  @Prop({ required: true, default: true })
  isLocked: boolean;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const MeterRecordSchema = SchemaFactory.createForClass(MeterRecord);
