import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Stock extends Document {
    @Prop()
    product: string;

    @Prop({ required: true })
    SKU: string;

    @Prop()
    name: string;

    @Prop()
    totalSalesCount: number;

    @Prop()
    lastYearSalesCount: number;

    @Prop()
    lastMonthSalesCount: number;

    @Prop()
    lastWeekSalesCount: number;

    @Prop()
    unit: string;

    @Prop({ default: 0 })
    stock: number;

    @Prop()
    stockLow: number;

    @Prop()
    stockAlert: number;

    @Prop()
    lastSupplier: string;

    @Prop()
    LastReceiver: string;

    @Prop()
    LastReturned?: string;

    @Prop()
    lastStockedDate?: Date;
}

export type StockDocument = Stock & Document;
export const StockSchema = SchemaFactory.createForClass(Stock);
