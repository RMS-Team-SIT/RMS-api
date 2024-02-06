import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Residence } from '../../residence/schemas/residence.schema';
import { Room } from '../../room/schemas/room.schema';

export type RenterDocument = Renter & Document;

@Schema()
export class Renter extends Document {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'Residence', required: true })
  residence: Residence;

  @Prop({ type: Types.ObjectId, ref: 'Room', default: null })
  room: Room;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ default: null })
  image: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: null })
  copyOfIdCard: string;

  @Prop({ default: null })
  renterContract: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const RenterSchema = SchemaFactory.createForClass(Renter);
