import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';

@Schema()
export class Supplier extends Document {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    phoneNumber: number;

    @Prop()
    address: string;

    @Prop({ default: [] })
    products: string[];

    @Prop()
    dateTime: Date;
}

export type SupplierDocument = Supplier & Document;
export const SupplierSchema = SchemaFactory.createForClass(Supplier);
