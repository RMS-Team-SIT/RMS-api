import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class ResidentContact extends Document {
    _id: string;

    @Prop({ default: '' })
    facebook: string;

    @Prop({ default: '' })
    line: string;

    @Prop({ default: '' })
    phone: string;

    @Prop({ default: '' })
    email: string;

    @Prop({ default: '' })
    address: string;

    @Prop({ required: true, default: Date.now() })
    created_at: Date;

    @Prop({ required: true, default: Date.now() })
    updated_at: Date;
}

export const ResidentContactSchema = SchemaFactory.createForClass(ResidentContact);
