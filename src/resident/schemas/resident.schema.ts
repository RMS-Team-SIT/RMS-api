import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schemas';
import { Room } from './room.schema';
import {
  ResidentContact,
  ResidentContactSchema,
} from './resident-contact.schema';
import { Announcement, AnnouncementSchema } from './anouncement.schema';
import { Rental } from './rental.schema';

export type ResidentDocument = Resident & Document;

@Schema()
export class Resident extends Document {
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

  @Prop({ type: ResidentContactSchema, default: undefined })
  contact: ResidentContact;

  @Prop({ default: '' })
  address: string;

  @Prop({ required: true })
  defaultWaterPriceRate: number;

  @Prop({ required: true })
  defaultLightPriceRate: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: Room.name }], default: [] })
  rooms: Room[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Rental.name }], default: [] })
  rentals: Rental[];

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const ResidentSchema = SchemaFactory.createForClass(Resident);
