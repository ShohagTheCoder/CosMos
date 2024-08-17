import { Prop } from '@nestjs/mongoose';

export default class Unit {
    @Prop()
    unit: string;

    @Prop()
    label: string;

    @Prop()
    base: string;

    @Prop()
    value: number;

    @Prop()
    changable: boolean;
}
