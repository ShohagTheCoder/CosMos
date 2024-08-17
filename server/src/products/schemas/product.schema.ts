import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import Base from 'src/units/schemas/base.schema';
import Unit from 'src/units/schemas/unit.schema';

export type ProductDocument = Product & Document;

// Price
class Price {
    @Prop()
    base: string;

    @Prop()
    maxUnit: number;

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
    unitBases: Map<string, Base>;

    @Prop({ required: true })
    units: Map<string, Unit>;

    @Prop({ required: true })
    prices: Map<string, Price>;

    @Prop({ required: true })
    measurements: Map<string, Measurement>;

    @Prop()
    createdBy: string; // insert user here

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
