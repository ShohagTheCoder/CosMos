import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    password: string;

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    actions: Record<string, object>;

    @Prop({ default: 'user' })
    role: string;

    @Prop()
    salary: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account' })
    account: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Setting' })
    setting: string;

    // Use an object for permissions
    @Prop({
        type: mongoose.Schema.Types.Mixed,
        default: {
            sale: false,
            purchase: false,
            dashboard: false,
            cashout: false,
            sendMoney: false,
            trashes: false,
            products: false,
        },
    })
    permissions: Record<string, boolean>;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
