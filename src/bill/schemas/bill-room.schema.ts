import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Renter } from '../../renter/schemas/renter.schema';
import { Room } from 'src/room/schemas/room.schema';
import { Bill } from './bill.schema';
import { MeterRecordItem } from 'src/meter-record/schemas/meter-record-item.schema';
import { MeterRecord } from 'src/meter-record/schemas/meter-record.schema';

export type BillRoomDocument = BillRoom & Document;
@Schema()
export class BillRoom extends Document {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  room: Room;

  @Prop({ type: Types.ObjectId, ref: 'Bill', required: true })
  bill: Bill;

  @Prop({ type: Types.ObjectId, ref: 'MeterRecord', required: true })
  meterRecord: MeterRecord;

  @Prop({ type: Types.ObjectId, ref: 'MeterRecord.MeterRecordItems', required: true })
  meterRecordItem: MeterRecordItem;

  // Water
  @Prop({ type: Number, required: false, default: 0 })
  currentWaterMeter: number;

  @Prop({ type: Number, required: false, default: 0 })
  previousWaterMeter: number;

  @Prop({ required: true })
  waterPriceRate: number;

  @Prop({ required: true })
  totalWaterMeterUsage: number;

  @Prop({ required: true })
  waterTotalPrice: number;

  // Electric/Electric are the same
  @Prop({ type: Number, required: false, default: 0 })
  previousElectricMeter: number;

  @Prop({ type: Number, required: true })
  currentElectricMeter: number;

  @Prop({ required: true })
  electricPriceRate: number;

  @Prop({ required: true })
  totalElectricMeterUsage: number;

  // RentalPrice
  @Prop({ required: true })
  roomRentalPrice: number;

  @Prop({ required: true })
  electricTotalPrice: number;

  // total
  @Prop({ required: true })
  totalPrice: number;

  // Paider
  @Prop({ type: Types.ObjectId, ref: Renter.name, default: null })
  paider: Renter;

  @Prop({ default: null })
  paidEvidenceImage: string;

  @Prop({ default: false, required: true })
  isPaid: boolean;

  @Prop({ default: null })
  paidDate: Date;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const BillRoomSchema = SchemaFactory.createForClass(BillRoom);
