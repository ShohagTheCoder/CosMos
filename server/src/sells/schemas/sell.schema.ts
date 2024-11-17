import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product } from 'src/products/dto/schemas/product.schema';

@Schema()
export class Sell {
    @Prop({ required: true, min: 0 })
    totalPrice: number;

    @Prop({ default: 'complete' })
    status: string;

    @Prop({ maxlength: 500 })
    note: string;

    @Prop({ required: true, type: Object })
    user: object;

    @Prop({ required: true, type: Map })
    products: Map<string, Product>;

    @Prop({ type: Object })
    customer?: object;

    @Prop()
    paid: number;

    @Prop()
    due: number;

    @Prop()
    customerTotalDue: number;

    @Prop()
    paidTransaction: string;

    @Prop()
    dueTransaction: string;

    @Prop({ default: Date.now })
    createdAt?: Date;

    @Prop()
    updatedBy?: string;

    @Prop({ default: Date.now })
    updatedAt?: Date;
}

export type SellDocument = Sell & Document;

export const SellSchema = SchemaFactory.createForClass(Sell);
