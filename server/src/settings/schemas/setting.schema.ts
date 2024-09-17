import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema({ timestamps: true }) // Automatically handles createdAt and updatedAt
export class Setting extends Document {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User.name,
    })
    user: string;

    @Prop({ default: true })
    darkMode: boolean;
}

export type SettingDocument = Setting & Document;
export const SettingSchema = SchemaFactory.createForClass(Setting);