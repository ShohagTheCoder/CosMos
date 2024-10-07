import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { TrashService } from './trash.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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
