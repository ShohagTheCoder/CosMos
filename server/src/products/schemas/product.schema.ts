import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Stock } from 'src/stocks/schemas/stocks.schema';

// Define nested schemas
@Schema()
export class Unit {
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

@Schema()
export class Price {
    @Prop()
    unit: string;

    @Prop()
    max: number;

    @Prop()
    price: number;
}

@Schema()
export class Measurement {
    @Prop()
    unit: string;

    @Prop()
    value: number;
}

export type ProductDocument = Product & Document;

@Schema({ timestamps: true }) // Automatically handles createdAt and updatedAt
export class Product extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ type: Map, of: Unit, required: true })
    units: Map<string, Unit>;

    @Prop({ type: [Price], required: true })
    prices: Price[];

    @Prop({ type: [Measurement], required: true })
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
    discount?: number;

    @Prop()
    extraDiscount?: number;

    @Prop({ default: 1 })
    quantity: number;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock',
        required: true,
    })
    stock: Stock;

    @Prop()
    createdBy?: string;

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
