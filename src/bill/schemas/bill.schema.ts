import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Renter } from '../../renter/schemas/renter.schema';
import { BillRoom, BillRoomSchema } from './bill-room.schema';

export type BillDocument = Bill & Document;
@Schema()
export class Bill extends Document {
  _id: string;

  @Prop({ required: true, default: Date.now() })
  record_date: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'BillRoom' }], default: [] })
  billRooms: BillRoom[];

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
