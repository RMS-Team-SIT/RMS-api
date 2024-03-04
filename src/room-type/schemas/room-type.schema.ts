import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Residence } from '../../residence/schemas/residence.schema';

export type FeeDocument = RoomType & Document;

@Schema()
export class RoomType extends Document {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'Residence', required: true })
  residence: Residence;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  size: number;

  @Prop({ default: '' })
  price: number;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const RoomTypeSchema = SchemaFactory.createForClass(RoomType);
