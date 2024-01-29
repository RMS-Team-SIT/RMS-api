import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { BillHistory, BillHistorySchema } from './bill-history.schema';
import { Document, Types } from 'mongoose';
import { Renter } from './renter.schema';
import { Residence } from './residence.schema';

export type RoomDocument = Room & Document;
@Schema()
export class Room extends Document {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'Residence', required: true })
  residence: Residence;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, default: 0 })
  floor: number;

  @Prop({ required: true, default: 0 })
  roomRentalPrice: number;

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

  @Prop({ type: Types.ObjectId, ref: 'Renter', default: null })
  currentRenter: Renter;

  @Prop({ type: [{ type: Types.ObjectId, ref: BillHistory.name }], default: [] })
  billHistories: BillHistory[];

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}
export const RoomSchema = SchemaFactory.createForClass(Room);