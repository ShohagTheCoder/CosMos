import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { TrashService } from './trash.service';
import { CreateTrashDto } from './dto/create-trash.dto';
import { UpdateTrashDto } from './dto/update-trash.dto';

@Controller('trash')
export class TrashController {
    constructor(private readonly trashService: TrashService) {}

    @Get()
    findAll() {
        return this.trashService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.trashService.findOne(+id);
    }

    @Get('restore/:id')
    async restore(@Param('id') id: string) {
        return await this.trashService.restore(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.trashService.remove(+id);
    }
}
