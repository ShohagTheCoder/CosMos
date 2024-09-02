import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Trash extends Document {
    @Prop()
    source: string;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    data: any;
}

export type TrashDocument = Trash | Document;
export const TrashSchema = SchemaFactory.createForClass(Trash);
