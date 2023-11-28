import mongoose, { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schemas';
import { Room, RoomSchema } from './room.schema';
import {
  ResidentContact,
  ResidentContactSchema,
} from './resident-contact.schema';
import { Announcement, AnnouncementSchema } from './anouncement.schema';
import { Rental, RentalSchema } from './rental.schema';
@Schema()
export class Resident extends Document {
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  owner: User;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
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

  @Prop({ type: [RoomSchema], default: [] })
  rooms: Room[];

  @Prop({ type: [RentalSchema], default: [] })
  rentals: Rental[];

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const ResidentSchema = SchemaFactory.createForClass(Resident);
