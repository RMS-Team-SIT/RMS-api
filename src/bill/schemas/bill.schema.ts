import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Renter } from '../../renter/schemas/renter.schema';

export type BillDocument = Bill & Document;
@Schema()
export class Bill extends Document {
  _id: string;

  @Prop({ required: true, default: Date.now() })
  date: Date;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
