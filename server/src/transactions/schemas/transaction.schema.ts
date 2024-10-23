import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Transaction extends Document {
    @Prop({ required: true })
    sender: string;

    @Prop({ required: true })
    senderName: string;

    @Prop({ default: '' })
    receiver: string;

    @Prop({ default: 'Unknown' })
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
    createdAt: Date;
}

export type TransactionDocument = Transaction & Document;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
