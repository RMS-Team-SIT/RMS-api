import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../../auth/enum/user-role.enum';
import { Document, Types } from 'mongoose';
import { Residence } from 'src/residence/schemas/residence.schema';
import { Room } from 'src/room/schemas/room.schema';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  _id: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: null })
  profileImage: string;

  @Prop({ default: null })
  resetPasswordToken: string;

  @Prop({ default: null })
  resetPasswordExpires: Date;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: null })
  idcardNumber: string;

  @Prop({ default: false })
  isApprovedKYC: boolean;

  @Prop({ default: false })
  isRejectedKYC: boolean;

  @Prop({ default: false })
  isAcceptedPolicy: boolean;

  @Prop({ default: null })
  emailVerificationToken: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: [UserRole.USER] })
  role: UserRole[];

  @Prop({ default: true })
  isSendEmailForNotification: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Notification' }], default: [] })
  notifications: Notification[];

  // For only renter
  // @Prop({ type: Types.ObjectId, ref: 'Residence', required: true })
  // residence: Residence;

  // @Prop({ type: Types.ObjectId, ref: 'Room', default: null })
  // room: Room;

  // @Prop({ default: null })
  // copyOfIdCard: string;

  // @Prop({ default: null })
  // renterContract: string;

  // @Prop({ default: true })
  // isActive: boolean;
  // End of renter

  // Time
  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
