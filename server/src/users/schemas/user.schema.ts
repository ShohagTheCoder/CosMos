import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop()
    username: string;

    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    actions: Record<string, object>;

    @Prop()
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
