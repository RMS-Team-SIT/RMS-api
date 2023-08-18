import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class RoomUser {
  _id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, default: '' })
  profileImage: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}
export const RoomUserSchema = SchemaFactory.createForClass(RoomUser);
