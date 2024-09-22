import { Controller, Get, Body, Patch, Param, Post } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { Command } from './schemas/command.schema';

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

    // Route for creating a single command
    @Post()
    createOne(@Body() command: Command) {
        return this.commandsService.createOne(command);
    }

    // Route for creating multiple commands
    @Post('create-many')
    createMany(@Body() commands: Command[]) {
        return this.commandsService.createMany(commands);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCommandDto: any) {
        return this.commandsService.update(id, updateCommandDto);
    }
}
