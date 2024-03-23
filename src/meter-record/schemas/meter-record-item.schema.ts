import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Room } from 'src/room/schemas/room.schema';
import { MeterRecord } from './meter-record.schema';

export type MeterRecordItemDocument = MeterRecordItem & Document;

@Schema()
export class MeterRecordItem extends Document {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  room: Room;

  @Prop({ type: Number, required: false, default: 0 })
  currentWaterMeter: number;

  @Prop({ type: Number, required: false, default: 0 })
  previousWaterMeter: number;

  @Prop({ type: Number, required: false, default: 0 })
  previousElectricMeter: number;

  @Prop({ type: Number, required: true })
  currentElectricMeter: number;

  @Prop({ type: Number, required: true })
  totalWaterMeterUsage: number;

  @Prop({ type: Number, required: true })
  totalElectricMeterUsage: number;

  // isLocked means that the record-item is not allowed to be updated.
  // Case 1: When the bill is generated, the record-item is locked.
  // Case 2: When create a new record-item, all the previous record is locked.
  @Prop({ default: true })
  isLocked: boolean;

  // isBillGenerated means that the bill is generated from this record-item.
  @Prop({ default: false })
  isBillGenerated: boolean;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const MeterRecordItemSchema =
  SchemaFactory.createForClass(MeterRecordItem);
