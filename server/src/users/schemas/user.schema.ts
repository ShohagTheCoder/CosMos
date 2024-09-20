import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    actions: Record<string, object>;

    @Prop({ default: 'user' })
    role: string;

    @Prop()
    salary: number;

    @Prop()
    account: string;

    @Prop()
    setting: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
