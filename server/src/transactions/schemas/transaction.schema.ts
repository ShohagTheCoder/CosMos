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
    amount: string;

    @Prop()
    senderNewBalance: string;

    @Prop()
    receiverNewBalance: string;

    @Prop()
    senderLastTransaction: number;

    @Prop()
    receiverLastTransaction: number;

    @Prop()
    action: string;

    @Prop()
    nonte: string;

    @Prop()
    date: Date;
}

export type TransactionDocument = Transaction & Document;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
