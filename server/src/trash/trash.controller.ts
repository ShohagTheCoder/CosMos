import { Controller, Get, Param, Delete } from '@nestjs/common';
import { TrashService } from './trash.service';

@Controller('trash')
export class TrashController {
    constructor(private readonly trashService: TrashService) {}

    @Get()
    findAll() {
        return this.trashService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.trashService.findOne(id);
    }

    @Get('restore/:id')
    async restore(@Param('id') id: string) {
        return await this.trashService.restore(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.trashService.remove(id);
    }
}
