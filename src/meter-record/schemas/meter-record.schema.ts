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

  @Prop({ type: Types.ObjectId, ref: 'Bill', required: true, default: null })
  bill: Bill;

  @Prop({ required: true, default: Date.now() })
  record_date: Date;

  @Prop({ type: [MeterRecordItemSchema], default: [] })
  meterRecordItems: MeterRecordItem[];

  // isLocked means that the record is not allowed to be updated. 
  // Case 1: When the bill is generated, the record is locked.
  // Case 2: When create a new record, all the previous record is locked.
  @Prop({ required: true, default: true })
  isLocked: boolean;

  @Prop({ required: true, default: false })
  isBillGenerated: boolean;

  @Prop({ required: true, default: false })
  isFirstInitRecord: boolean;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const MeterRecordSchema = SchemaFactory.createForClass(MeterRecord);
