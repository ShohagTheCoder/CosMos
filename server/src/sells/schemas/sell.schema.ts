import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SellDocument = Sell & Document;

@Schema()
export class Sell {
    @Prop({ required: true, min: 0 })
    totalPrice: number;

    @Prop({ maxlength: 500 })
    note: string;

    @Prop({ required: true, type: Object })
    user: object;

    @Prop({ required: true, type: Object })
    cart: object;

    @Prop({ type: Object })
    customer: object;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const SellSchema = SchemaFactory.createForClass(Sell);
