import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true }) // Automatically handles createdAt and updatedAt
export class Setting extends Document {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    })
    user: string;

    @Prop({ default: true })
    darkMode: boolean;

    @Prop({ default: true })
    productImage: boolean;

    @Prop({ default: true })
    cartImage: boolean;

    @Prop({ default: true })
    stockImage: boolean;

    @Prop({ default: true })
    productRow: boolean;
}

export type SettingDocument = Setting & Document;
export const SettingSchema = SchemaFactory.createForClass(Setting);
