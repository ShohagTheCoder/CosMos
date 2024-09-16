import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Stock } from '../../stocks/schemas/stocks.schema';

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
    dynamicValue: boolean;

    @Prop()
    base: string;

    @Prop({ default: true })
    enable: boolean;
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

    @Prop({ default: 'product.jpg' })
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

    @Prop({ default: 0 })
    updatePrice: number;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    resources: Record<string, Resource>;

    @Prop()
    resourcesCost: number;

    @Prop({ default: true })
    discountEnable: boolean;

    @Prop({ default: 0 })
    discount: number;

    @Prop()
    discounts?: number[];

    @Prop({
        default: function (this: Product) {
            return Math.floor(this.price / 5);
        },
    })
    maximumDiscount: number;

    @Prop({ default: 0 })
    extraDiscount: number;

    @Prop({ default: true })
    sellEnable: boolean;

    @Prop({ default: true })
    purchaseEnable: boolean;

    @Prop()
    displaySaleUnit: string;

    @Prop()
    displayPurchaseUnit: string;

    @Prop({ default: 1 })
    quantity: number;

    @Prop({ default: 1 })
    count: number;

    @Prop({ default: 1 })
    priority: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Stock.name })
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
