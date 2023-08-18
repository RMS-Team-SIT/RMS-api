import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class BillHistory {
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

  @Prop({ required: true, default: '' })
  paidEvidenceImage: string;

  @Prop({ required: true, default: false })
  isPaid: boolean;

  @Prop({ required: true, default: undefined })
  paidDate: Date;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}
export const BillHistorySchema = SchemaFactory.createForClass(BillHistory);
