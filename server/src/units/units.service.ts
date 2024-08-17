import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import path from 'path';

@Injectable()
export class UnitsService {
    public data: { name: string; unit: string; value: number }[];

    constructor() {
        const filePath = path.resolve(__dirname, 'data.json');
        const rawData = readFileSync(filePath, 'utf8');
        this.data = JSON.parse(rawData);
    }
}
