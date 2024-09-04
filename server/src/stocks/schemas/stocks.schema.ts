import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StockDocument = Stock & Document;

@Schema()
export class Stock extends Document {
    @Prop()
    product: string;

    @Prop()
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

    @Prop()
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

export const StockSchema = SchemaFactory.createForClass(Stock);