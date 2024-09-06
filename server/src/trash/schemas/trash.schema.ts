import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

// Define the schema with decorators
@Schema()
export class Trash extends Document {
    @Prop({ required: true })
    source: string;

    @Prop()
    connect?: string; // Make connect optional if it is not always required

    @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
    data: any;
}

// Type for documents
export type TrashDocument = Trash & Document;
export const TrashSchema = SchemaFactory.createForClass(Trash);
