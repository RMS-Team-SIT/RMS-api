import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Residence } from '../../residence/schemas/residence.schema';

export type FeeDocument = Fee & Document;

@Schema()
export class Fee extends Document {
    _id: string;

    @Prop({ type: Types.ObjectId, ref: 'Residence', required: true })
    residence: Residence;

    @Prop({ required: true })
    feeName: string;

    @Prop({ default: '' })
    feePrice: string;

    @Prop({ required: true, default: Date.now() })
    created_at: Date;

    @Prop({ required: true, default: Date.now() })
    updated_at: Date;
}

export const FeeSchema = SchemaFactory.createForClass(Fee);
