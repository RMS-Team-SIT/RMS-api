import { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../role/enum/user-role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: UserRole.LANDLORD })
  role: UserRole;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
