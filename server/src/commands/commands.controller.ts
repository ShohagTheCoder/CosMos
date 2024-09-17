import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { CommandsService } from './commands.service';

@Controller('commands')
export class CommandsController {
    constructor(private readonly commandsService: CommandsService) {}

    @Get()
    findAll() {
        return this.commandsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.commandsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCommandDto: any) {
        return this.commandsService.update(id, updateCommandDto);
    }
}
