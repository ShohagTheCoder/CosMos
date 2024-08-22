import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Account extends Document {
    @Prop()
    owner: string;

    @Prop()
    name: string;

    @Prop()
    username: string;

    @Prop()
    password: string;

    @Prop()
    balance: number;

    @Prop()
    minimumBalance: number;

    @Prop()
    maximumBalance: number;

    @Prop()
    limit: number; // Single transaction limit

    @Prop()
    lastTransaction: string;

    @Prop()
    lastTransactionAmount: number;

    @Prop()
    lastTransactionDate: string;

    @Prop()
    lastTransactionAccountName: string;

    @Prop()
    lastTransactionAction: string;

    @Prop()
    lastTransactionNote: string;
}

export type AccountDocument = Account & Document;
export const AccountSchema = SchemaFactory.createForClass(Account);
