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

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }) // Use 'Account' directly
    account: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Setting' }) // Use 'Setting' directly
    setting: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
