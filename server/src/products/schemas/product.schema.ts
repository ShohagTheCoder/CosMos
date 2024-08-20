import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

class Unit {
    @Prop()
    unit: string;

    @Prop()
    dynamic: boolean;

    @Prop()
    value: number;

    @Prop()
    label: string;

    @Prop()
    base: string;
}

// Price
class Price {
    @Prop()
    unit: string;

    @Prop()
    max: number;

    @Prop()
    price: number;
}

// Measurement
class Measurement {
    @Prop()
    unit: string;

    @Prop()
    value: number;
}

@Schema()
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    units: Map<string, Unit>;

    @Prop({ required: true })
    prices: Price[];

    @Prop({ required: true })
    measurements: Measurement[];

    @Prop({ required: true })
    price: number;

    @Prop({
        default: function (this: Product) {
            return this.price;
        },
    })
    subTotal: number;

    @Prop({ required: true })
    unit: string;

    @Prop()
    discount: number; // insert user here

    @Prop()
    extraDiscount: number; // insert user here

    @Prop({ default: 1 })
    quantity: number;

    @Prop()
    createdBy: string; // insert user here

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
