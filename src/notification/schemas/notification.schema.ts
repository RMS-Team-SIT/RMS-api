import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schemas';
import { NotificationType } from '../enum/notification-type.enum';
import { Renter } from 'src/renter/schemas/renter.schema';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  _id: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: false, default: [] })
  tos: User[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Renter' }], required: false, default: [] })
  toRenters: Renter[];

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: false })
  isSentEmail: boolean;

  @Prop({ required: true, default: NotificationType.TO_USER })
  type: NotificationType;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
