import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { RoomUser, RoomUserSchema } from './room-user.schemas';
import { BillHistory, BillHistorySchema } from './bill.schemas';
import { Document } from 'mongoose';

@Schema()
export class Room extends Document {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: '' })
  description: string;

  @Prop({ required: true, default: 0 })
  waterPriceRate: number;

  @Prop({ required: true, default: 0 })
  lightPriceRate: number;

  @Prop({ required: true, default: 0 })
  currentWaterGauge: number;

  @Prop({ required: true, default: 0 })
  currentLightGauge: number;

  @Prop({ type: [RoomUserSchema], default: undefined })
  roomUsers: RoomUser[];

  @Prop({ type: [BillHistorySchema], default: undefined })
  billHistories: BillHistory[];

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}
export const RoomSchema = SchemaFactory.createForClass(Room);
