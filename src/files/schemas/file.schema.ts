import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class ResidenceFile extends Document {
  _id: string;

  @Prop({ required: true })
  filesName: string;

  @Prop({ required: true })
  filePath: string;
}
export const ResidenceFileSchema = SchemaFactory.createForClass(ResidenceFile);
