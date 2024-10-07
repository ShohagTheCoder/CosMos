import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

// Define a type for Permissions
export interface Permissions {
    sale: boolean;
    purchase: boolean;
    dashboard: boolean;
    cashout: boolean;
    sendMoney: boolean;
    trashes: boolean;
    products: boolean;
}

// Define a type for Actions (if needed)
export interface Actions {
    [action: string]: Record<string, any>; // This can be refined based on the actions structure.
}

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    password: string;

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
    actions: Actions;

    @Prop({ default: 'user' })
    role: string;

    @Prop()
    salary?: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account' })
    account: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Setting' })
    setting: string;

    // Use the Permissions interface for better typing
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
    permissions: Permissions;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
