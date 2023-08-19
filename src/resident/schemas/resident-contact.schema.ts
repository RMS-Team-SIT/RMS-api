import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class ResidentContact extends Document {
    _id: string;

    @Prop({ required: true, default: '' })
    facebook: string;

    @Prop({ required: true, default: '' })
    line: string;

    @Prop({ required: true, default: '' })
    phone: string;

    @Prop({ required: true, default: '' })
    email: string;

    @Prop({ required: true, default: '' })
    address: string;

    @Prop({ required: true, default: Date.now() })
    created_at: Date;

    @Prop({ required: true, default: Date.now() })
    updated_at: Date;
}

export const ResidentContactSchema = SchemaFactory.createForClass(ResidentContact);
