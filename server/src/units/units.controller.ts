import { Controller, Get } from '@nestjs/common';
import { UnitsService } from './units.service';

@Controller('units')
export class UnitsController {
    constructor(private readonly unitsService: UnitsService) {}

    @Get()
    getData() {
        return this.unitsService.data;
    }
}
