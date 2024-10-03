import { Controller, Get } from '@nestjs/common';
import { ClearService } from './clear.service';

@Controller('clear')
export class ClearController {
    constructor(private readonly clearService: ClearService) {}

    @Get()
    clear() {
        return this.clearService.clear();
    }
}
