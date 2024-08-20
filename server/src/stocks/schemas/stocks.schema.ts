import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type StockDocument = Stock & Document;

@Schema()
export class Stock extends Document {
    @Prop()
    SKU: string;

    @Prop()
    name: string;

    @Prop()
    stock: number;

    @Prop()
    lastSupplier: string;

    @Prop()
    LastReceiver: string;

    @Prop()
    lastStockedDate: Date;
}

export const StockSchema = SchemaFactory.createForClass(Stock);
