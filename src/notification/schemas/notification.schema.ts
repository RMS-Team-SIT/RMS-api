import { Schema, SchemaFactory } from "@nestjs/mongoose";

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
    _id: string;

    to: string;

    
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
