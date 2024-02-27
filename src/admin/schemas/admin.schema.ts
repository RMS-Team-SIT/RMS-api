import { Prop, SchemaFactory } from "@nestjs/mongoose";

export type AdminDocument = Admin & Document;

export class Admin {

    _id: string;
    
    @Prop({ required: true })
    username: string;
    
    @Prop({ required: true })
    password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);