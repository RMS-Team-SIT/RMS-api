import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type RMSConfigDocument = RMSConfig & Document;

@Schema()
export class RMSConfig extends Document {

    _id: string;

    // @Prop({ required: true })
    // name: string;

    // @Prop({ required: true })
    // value: boolean;

    // @Prop({ required: false, default: '' })
    // description: string;
    
    @Prop({ required: true })
    isAutoApproveKYC: boolean;

    @Prop({ required: true })
    isAutoApproveResidence: boolean;

}

export const RMSConfigSchema = SchemaFactory.createForClass(RMSConfig);