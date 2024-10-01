import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Transaction extends Document {
    @Prop({ default: '' })
    sender: string;

    @Prop({ default: 'Anonymous Sender' })
    senderName: string;

    @Prop({ default: '' })
    receiver: string;

    @Prop({ default: 'Anonymous Receiver' })
    receiverName: string;

    @Prop({ default: 0 })
    amount: number;

    @Prop({ default: 0 })
    senderNewBalance: number;

    @Prop({ default: 0 })
    receiverNewBalance: number;

    @Prop({ default: '' })
    senderLastTransaction: string;

    @Prop({ default: '' })
    receiverLastTransaction: string;

    @Prop({ default: 'Cashout or Unknown' })
    action: string;

    @Prop({ default: '' })
    note: string;

    @Prop({ default: Date.now })
    date: Date;
}

export type TransactionDocument = Transaction & Document;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
