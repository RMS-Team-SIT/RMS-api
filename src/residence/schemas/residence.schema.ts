import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schemas';
import { Room } from '../../room/schemas/room.schema';
import {
  ResidenceContact,
  ResidenceContactSchema,
} from './residence-contact.schema';
import { Announcement, AnnouncementSchema } from './anouncement.schema';
import { Renter } from '../../renter/schemas/renter.schema';
import { Payment } from '../../payment/schemas/payment.schema';
import { MeterRecord } from 'src/meter-record/schemas/meter-record.schema';
import { Bill } from 'src/bill/schemas/bill.schema';
import { ResidenceInfo, ResidenceInfoSchema } from './residence-info.schema';
import { Facility } from '../../facility/schemas/facility.schema';

export type ResidenceDocument = Residence & Document;

@Schema()
export class Residence extends Document {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  owner: User;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({ type: ResidenceInfoSchema, default: null })
  info: ResidenceInfo;

  @Prop({ type: [{ type: Types.ObjectId, ref: Facility.name }], default: [] })
  facilities: Facility[];

  @Prop({ default: [] })
  images: string[];

  @Prop({ default: [] })
  locationImages: string[];

  @Prop({ type: [AnnouncementSchema], default: [] })
  announcements: Announcement[];

  @Prop({ type: ResidenceContactSchema, required: true })
  contact: ResidenceContact;

  @Prop({ default: null })
  residenceBusinessLicense: string;

  @Prop({ default: false })
  isApproved: boolean;

  @Prop({ default: '' })
  address: string;

  @Prop({ required: true })
  defaultWaterPriceRate: number;

  @Prop({ required: true })
  defaultElectricPriceRate: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: Room.name }], default: [] })
  rooms: Room[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Renter' }], default: [] })
  renters: Renter[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Payment.name }], default: [] })
  payments: Payment[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: MeterRecord.name }],
    default: [],
  })
  meterRecord: MeterRecord[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: Bill.name }],
    default: [],
  })
  bills: Bill[];

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const ResidenceSchema = SchemaFactory.createForClass(Residence);
