import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class ResidentFile extends Document {
  _id: string;

  @Prop({ required: true })
  filesName: string;

  @Prop({ required: true })
  filePath: string;
}
export const ResidentFileSchema = SchemaFactory.createForClass(ResidentFile);
