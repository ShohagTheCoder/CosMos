import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

// Define nested schemas
@Schema()
export class Unit {
    @Prop({
        default: function (this: Unit) {
            // Set default unit as the key of this unit object in `Product.units`
            const unitKeys = Object.keys(this['_parent']?.units || {});
            return unitKeys.length > 0 ? unitKeys[0] : '';
        },
    })
    unit: string;

    @Prop()
    dynamic: boolean;

    @Prop({ default: 1 })
    value: number;

    @Prop()
    label: string;

    @Prop({ default: 1 })
    dynamicValue: boolean;

    @Prop()
    base: string;

    @Prop({ default: true })
    enable: boolean;
}

// Convert Unit schema to Mongoose schema
const UnitSchema = SchemaFactory.createForClass(Unit);

@Schema()
export class Price {
    @Prop()
    unit: string;

    @Prop({ required: true, default: 1 })
    start: number;

    @Prop({ type: Number, required: true })
    price: number;
}

@Schema()
export class Measurement {
    @Prop()
    unit: string;

    @Prop({ default: 1 })
    value: number;
}

@Schema()
export class Resource {
    @Prop()
    _id: string;

    @Prop()
    unit: string;

    @Prop({ default: 1 })
    count: number;

    @Prop({ default: 1 })
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

    // Define `units` as a map of subdocuments
    @Prop({
        type: mongoose.Schema.Types.Map,
        of: UnitSchema,
        required: true,
    })
    units: Record<string, Unit>;

    @Prop({ required: true })
    prices: Price[];

    @Prop({ required: true })
    measurements: Measurement[];

    @Prop({ default: ['keyword'] })
    keywords: string[];

    @Prop()
    saleUnitsBase: string;

    @Prop({ required: true })
    purchasePrices: Price[];

    @Prop({ required: true })
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

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' })
    brand: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
    category: string;

    @Prop({ default: false })
    hasResources: boolean;

    @Prop({ default: 0 })
    updatePrice: number;

    @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
    resources: Record<string, Resource>;

    @Prop({ default: 0 })
    resourcesCost: number;

    @Prop({ default: true })
    discountEnable: boolean;

    @Prop({ default: 0 })
    discount: number;

    @Prop()
    discounts?: number[];

    @Prop({
        default: function (this: Product) {
            return Math.floor(this.price / 2);
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
    note: string;

    @Prop()
    displayPurchaseUnit: string;

    @Prop({ default: 1 })
    quantity: number;

    @Prop({ default: 1 })
    count: number;

    @Prop({ default: 1 })
    priority: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Stock' })
    stock: string;

    @Prop({ default: 50 })
    stockLow: number;

    @Prop({ default: 20 })
    stockAlert: number;

    @Prop()
    createdBy?: string;

    @Prop({ default: Date.now })
    createdAt?: Date;

    @Prop()
    updatedBy?: string;

    @Prop({ default: Date.now })
    updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
