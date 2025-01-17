import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Business extends Document {
    @Prop({ required: false, default: 'Business Name' })
    name: string;

    @Prop({
        type: Object,
        required: true,
        default: {
            print: {
                name: 'Name',
                phone: '000-000-0000',
                title: 'Title',
                address: 'Address',
                discount: false,
                message: 'Message',
            },
        },
    })
    settings: {
        print: {
            name: string;
            phone: string;
            title: string;
            discount: boolean;
            address: string;
            message: string;
        };
    };
}

export type BusinessDocument = Business & Document;

export const BusinessSchema = SchemaFactory.createForClass(Business);
