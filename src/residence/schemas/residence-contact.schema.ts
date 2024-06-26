import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type ResidenceContactDocument = ResidenceContact & Document;

@Schema()
export class ResidenceContact extends Document {
  _id: string;

  @Prop({ required: true })
  contactName: string;

  @Prop({ default: '' })
  facebook: string;

  @Prop({ default: '' })
  line: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;
}

export const ResidenceContactSchema =
  SchemaFactory.createForClass(ResidenceContact);
