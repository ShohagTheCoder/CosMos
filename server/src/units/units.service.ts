import { Injectable } from '@nestjs/common';
import units from './units';
import bases from './bases';

@Injectable()
export class UnitsService {
    public data: { units: object; bases: object };

    constructor() {
        this.data = { units, bases };
    }
}
