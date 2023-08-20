import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Announcement extends Document {
    _id: string;

    @Prop({ required: true, default: Date.now() })
    date: Date;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ default: [null] })
    images: string[];

    @Prop({ required: true, default: Date.now() })
    created_at: Date;

    @Prop({ required: true, default: Date.now() })
    updated_at: Date;
}
export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
