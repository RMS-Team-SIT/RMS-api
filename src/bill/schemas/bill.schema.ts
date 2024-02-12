import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Renter } from '../../renter/schemas/renter.schema';
import { BillRoom, BillRoomSchema } from './bill-room.schema';
import { MeterRecord } from 'src/meter-record/schemas/meter-record.schema';
import { MeterRecordItem } from 'src/meter-record/schemas/meter-record-item.schema';
import { Residence } from 'src/residence/schemas/residence.schema';

export type BillDocument = Bill & Document;
@Schema()
export class Bill extends Document {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'Residence', required: true })
  residence: Residence;

  @Prop({ required: true, default: Date.now() })
  record_date: Date;

  @Prop({ type: Types.ObjectId, ref: 'MeterRecord', required: true })
  meterRecord: MeterRecord;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'BillRoom' }], default: [] })
  billRooms: BillRoom[];

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
