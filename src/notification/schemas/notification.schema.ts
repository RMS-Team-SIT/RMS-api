import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User } from "src/user/schemas/user.schemas";

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
    _id: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    to: User;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ default: false })
    isRead: boolean;

    @Prop({ default: false })
    isSentEmail: boolean;

    @Prop({ required: true, default: Date.now() })
    created_at: Date;

    @Prop({ required: true, default: Date.now() })
    updated_at: Date;

}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
