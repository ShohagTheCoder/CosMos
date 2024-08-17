import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
    Customer,
    CustomerSchema,
} from 'src/customers/schemas/customer.schema';
import { Product } from 'src/products/schemas/product.schema';

export type SellDocument = Sell & Document;

@Schema()
export class Sell {
    @Prop({ required: true, min: 0 })
    totalPrice: number;

    @Prop({ maxlength: 500 })
    note: string;

    @Prop({ required: true, type: Object })
    user: object;

    @Prop({ required: true, type: Map })
    cart: Map<string, Product>;

    @Prop({ type: CustomerSchema })
    customer: Customer;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const SellSchema = SchemaFactory.createForClass(Sell);
