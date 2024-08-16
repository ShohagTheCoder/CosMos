import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema()
export class Customer {
    @Prop({ required: true, unique: true })
    fullName: string;

    @Prop({ required: false, unique: true })
    email: string;

    @Prop()
    address: string;

    @Prop({ required: true, unique: true })
    phoneNumber: string;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
