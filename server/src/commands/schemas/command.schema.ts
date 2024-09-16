import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type CommandDocument = Command & Document;

@Schema()
export class Command {
    @Prop({ required: true })
    command: string;

    @Prop({ type: String, default: null }) // Remove 'required: true'
    type: string | null;

    @Prop({ type: String, default: null }) // Remove 'required: true'
    value: string | null;
}

export const CommandSchema = SchemaFactory.createForClass(Command);
