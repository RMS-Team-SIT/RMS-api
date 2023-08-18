import mongoose, { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class RoomUser extends Document {
  _id: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  profileImage: string;
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
}
export const RoomUserSchema = SchemaFactory.createForClass(RoomUser);