import mongoose, { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schemas';
import { Room, RoomSchema } from './room.schemas';
@Schema()
export class Resident extends Document {

  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  defaultWaterPriceRate: number;

  @Prop({ required: true })
  defaultLightPriceRate: number;

  @Prop({ type: [RoomSchema], default: [] })
  rooms: Room[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  owner: User;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const ResidentSchema = SchemaFactory.createForClass(Resident);
