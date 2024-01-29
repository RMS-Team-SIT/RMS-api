import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schemas';
import { Room } from './room.schema';
import {
  ResidenceContact,
  ResidenceContactSchema,
} from './residence-contact.schema';
import { Announcement, AnnouncementSchema } from './anouncement.schema';
import { Renter } from './renter.schema';
import { Payment } from './payment.schema';

export type ResidenceDocument = Residence & Document;

@Schema()
export class Residence extends Document {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: User;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({ default: [] })
  images: string[];

  @Prop({ type: [AnnouncementSchema], default: [] })
  announcements: Announcement[];

  @Prop({ type: ResidenceContactSchema, default: undefined })
  contact: ResidenceContact;

  @Prop({ default: '' })
  address: string;

  @Prop({ required: true })
  defaultWaterPriceRate: number;

  @Prop({ required: true })
  defaultLightPriceRate: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: Room.name }], default: [] })
  rooms: Room[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Renter.name }], default: [] })
  renters: Renter[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Payment.name }], default: [] })
  payments: Payment[];

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const ResidenceSchema = SchemaFactory.createForClass(Residence);
