import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';
import { Supplier } from 'src/suppliers/schemas/supplier.schema';
import { User } from 'src/users/entities/user.entity';

@Schema()
export class Purchase extends Document {
    @Prop()
    supplier: Supplier;

    @Prop({ type: Map })
    products: Map<string, Product>;

    @Prop()
    receiver: User;

    @Prop()
    totalPrice: number;

    @Prop()
    note: string;

    @Prop()
    transaction: string;

    @Prop()
    dateTime: Date;
}

export type PurchaseDocument = Purchase & Document;
export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
