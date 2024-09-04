import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

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

@Schema()
export class Resource {
    @Prop()
    _id: string;

    @Prop()
    unit: string;

    @Prop()
    count: number;

    @Prop()
    quantity: number;
}

export type ProductDocument = Product & Document;

@Schema({ timestamps: true }) // Automatically handles createdAt and updatedAt
export class Product extends Document {
    @Prop({ required: true })
    SKU: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop()
    image: string;

    @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
    units: Record<string, Unit>;

    @Prop({ type: [Price], required: true })
    prices: Price[];

    @Prop({ type: [Measurement], required: true })
    measurements: Measurement[];

    @Prop()
    saleUnitsBase: string;

    @Prop({ type: [Price], required: true })
    purchasePrices: Price[];

    @Prop({ type: [Measurement], required: true })
    purchaseMeasurements: Measurement[];

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
    hasResources: boolean;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    resources: Record<string, Resource>;

    @Prop()
    resourcesCost: number;

    @Prop()
    discount?: number;

    @Prop()
    extraDiscount?: number;

    @Prop({ default: true })
    availableForSale: boolean;

    @Prop({ default: true })
    availableForPurchase: boolean;

    @Prop({ default: 1 })
    quantity: number;

    @Prop({ default: 1 })
    count: number;

    @Prop({ default: 1 })
    priority: number;

    @Prop()
    stock: string;

    @Prop()
    stockLow: number;

    @Prop()
    stockAlert: number;

    @Prop()
    createdBy?: string;

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
