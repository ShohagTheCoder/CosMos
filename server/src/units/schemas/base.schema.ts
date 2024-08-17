import { Prop } from '@nestjs/mongoose';

// Unit Base
export default class Base {
    @Prop()
    base: string;

    @Prop()
    label: string;
}
