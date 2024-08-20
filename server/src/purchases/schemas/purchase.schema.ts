import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product } from 'src/products/schemas/product.schema';

@Schema()
export class Purchase {
    @Prop()
    supplier: string;

    @Prop()
    products: Record<string, Product>;

    @Prop()
    receiver: string;

    @Prop()
    totalPrice: number;

    @Prop()
    dateTime: Date;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
