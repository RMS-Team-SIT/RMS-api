import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type ResidenceInfoDocument = ResidenceInfo & Document;

@Schema()
export class ResidenceInfo extends Document {
    _id: string;

    

    @Prop({ required: true, default: Date.now() })
    created_at: Date;

    @Prop({ required: true, default: Date.now() })
    updated_at: Date;
}

export const ResidenceInfoSchema =
    SchemaFactory.createForClass(ResidenceInfo);
