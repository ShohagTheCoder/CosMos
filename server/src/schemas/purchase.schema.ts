import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product } from 'src/products/dto/schemas/product.schema';
import { Supplier } from 'src/suppliers/schemas/supplier.schema';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class Purchase extends Document {
    @Prop()
    supplier: Supplier;

    @Prop({ type: Map })
    products: Map<string, Product>;

    @Prop()
    user: User;

    @Prop()
    totalPrice: number;

    @Prop()
    note: string;

    @Prop()
    transaction: string;

    @Prop({ default: Date.now })
    createdAt?: Date;

    @Prop()
    updatedBy?: string;

    @Prop({ default: Date.now })
    updatedAt?: Date;
}

export type PurchaseDocument = Purchase & Document;
export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
