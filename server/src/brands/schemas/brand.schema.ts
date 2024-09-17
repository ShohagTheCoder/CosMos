// brand.schema.ts mongodb and nestjsimport { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema({ timestamps: true })
export class Brand {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    logoUrl: string; // Optional field for storing a logo URL
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
