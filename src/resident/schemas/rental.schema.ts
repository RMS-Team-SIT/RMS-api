import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Resident } from './resident.schema';
import { Room } from './room.schema';

export type RentalDocument = Rental & Document;

@Schema()
export class Rental extends Document {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'Resident', required: true })
  resident: Resident;

  @Prop({ type: Types.ObjectId, ref: 'Room', default: null })
  room: Room;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ default: null })
  image: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true})
  password: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: null })
  copyOfIdCard: string;

  @Prop({ default: null })
  rentalContract: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const RentalSchema = SchemaFactory.createForClass(Rental);
