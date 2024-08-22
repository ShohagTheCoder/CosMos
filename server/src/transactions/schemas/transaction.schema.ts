import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Transaction extends Document {
    @Prop()
    sender: string;

    @Prop()
    senderName: string;

    @Prop()
    receiver: string;

    @Prop()
    receiverName: string;

    @Prop()
    amount: number;

    @Prop()
    senderNewBalance: number;

    @Prop()
    receiverNewBalance: number;

    @Prop()
    senderLastTransaction: string;

    @Prop()
    receiverLastTransaction: string;

    @Prop()
    action: string;

    @Prop()
    note: string;

    @Prop()
    date: Date;
}

export type TransactionDocument = Transaction & Document;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
