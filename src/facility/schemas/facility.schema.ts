import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type FacilityDocument = Facility & Document;

@Schema()
export class Facility extends Document {
    _id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, default: Date.now() })
    created_at: Date;

    @Prop({ required: true, default: Date.now() })
    updated_at: Date;
}

export const FacilitySchema =
    SchemaFactory.createForClass(Facility);
