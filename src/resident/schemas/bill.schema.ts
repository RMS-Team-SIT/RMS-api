import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BillHistory extends Document {
  _id: string;

  @Prop({ required: true, default: Date.now() })
  date: Date;

  @Prop({ required: true })
  waterPriceRate: number;

  @Prop({ required: true })
  lightPriceRate: number;

  @Prop({ required: true })
  waterGauge: number;

  @Prop({ required: true })
  lightGauge: number;

  @Prop({ required: true })
  waterTotalPrice: number;

  @Prop({ required: true })
  lightTotalPrice: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: null })
  paidEvidenceImage: string;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop({ default: null })
  paidDate: Date;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}
export const BillHistorySchema = SchemaFactory.createForClass(BillHistory);
