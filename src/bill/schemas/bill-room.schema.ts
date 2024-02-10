import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Renter } from '../../renter/schemas/renter.schema';
import { Room } from 'src/room/schemas/room.schema';
import { Bill } from './bill.schema';

export type BillRoomDocument = BillRoom & Document;
@Schema()
export class BillRoom extends Document {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  room: Room;

  @Prop({ type: Types.ObjectId, ref: 'Bill', required: true })
  bill: Bill;

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

  // total
  @Prop({ required: true })
  totalPrice: number;

  // Paider
  @Prop({ type: Types.ObjectId, ref: Renter.name, default: null })
  paider: Renter;

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
