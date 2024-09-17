import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, CommandDocument } from './schemas/command.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommandsService {
    constructor(
        @InjectModel(Command.name) private commandModel: Model<CommandDocument>,
    ) {}

    async findAll() {
        return await this.commandModel.find();
    }

    async findOne(id: string) {
        return await this.commandModel.findById(id);
    }

    async update(id: string, updateCommandDto: any) {
        const command = await this.commandModel.findById(id);

        if (command) {
            Object.assign(command, updateCommandDto);
            return command.save();
        }

        throw new Error('Command not found for id ' + id);
    }
}
