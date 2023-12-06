import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { RoomUser, RoomUserSchema } from './room-user.schema';
import { BillHistory, BillHistorySchema } from './bill-history.schema';
import mongoose, { Document, Types } from 'mongoose';
import { Rental } from './rental.schema';

@Schema()
export class Room extends Document {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'Resident' })
  resident: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, default: 0 })
  floor: number;

  @Prop({ required: true, default: false })
  isUseDefaultWaterPriceRate: boolean;

  @Prop({ required: true, default: false })
  isUseDefaultLightPriceRate: boolean;

  @Prop({ required: true, default: 0 })
  waterPriceRate: number;

  @Prop({ required: true, default: 0 })
  lightPriceRate: number;

  @Prop({ required: true, default: 0 })
  currentWaterGauge: number;

  @Prop({ required: true, default: 0 })
  currentLightGauge: number;

  @Prop({ type: Types.ObjectId, ref: 'resident.rentals', default: [] })
  currentRentals: Types.ObjectId[];

  @Prop({ type: [BillHistorySchema], default: [] })
  billHistories: BillHistory[];

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}
export const RoomSchema = SchemaFactory.createForClass(Room);
