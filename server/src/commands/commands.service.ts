import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, CommandDocument } from './schemas/command.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommandsService {
    constructor(
        @InjectModel(Command.name) private commandModel: Model<CommandDocument>,
    ) {}

    async createOne(command: Command): Promise<Command> {
        try {
            return await this.commandModel.create(command);
        } catch (error) {
            console.error('Error creating a single command:', error);
            throw new Error('Failed to create a single command');
        }
    }

    async createMany(commands: Command[]): Promise<Command[]> {
        try {
            // Retrieve all existing commands
            const existingCommands = await this.commandModel.find();

            // Combine new commands with existing commands
            const allCommands = [...existingCommands, ...commands];

            // Sort all commands (existing + new) together
            const sortedCommands = this.sortCommands(allCommands);

            // Clear the collection and insert the sorted commands to maintain the order
            await this.commandModel.deleteMany({});
            return await this.commandModel.insertMany(sortedCommands);
        } catch (error) {
            console.error('Error creating multiple commands:', error);
            throw new Error('Failed to create multiple commands');
        }
    }

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

    private sortCommands(commands: Command[]): Command[] {
        return commands.sort((a, b) => {
            const aMatch = a.command.match(/^(\d+)?(.*)$/);
            const bMatch = b.command.match(/^(\d+)?(.*)$/);

            const aNumberPart = aMatch?.[1] ?? ''; // Extracted number part (if any)
            const aCharPart = aMatch?.[2] ?? ''; // Extracted character part (if any)
            const bNumberPart = bMatch?.[1] ?? ''; // Extracted number part (if any)
            const bCharPart = bMatch?.[2] ?? ''; // Extracted character part (if any)

            const aStartsWithLetter = /^[a-zA-Z]/.test(a.command); // Check if starts with a letter
            const bStartsWithLetter = /^[a-zA-Z]/.test(b.command); // Check if starts with a letter

            // If a starts with a letter and b does not, a comes first
            if (aStartsWithLetter && !bStartsWithLetter) return -1;
            // If b starts with a letter and a does not, b comes first
            if (!aStartsWithLetter && bStartsWithLetter) return 1;

            // If both start with numbers, compare numerically
            if (!aStartsWithLetter && !bStartsWithLetter) {
                if (aNumberPart && bNumberPart) {
                    const aNumber = parseInt(aNumberPart, 10);
                    const bNumber = parseInt(bNumberPart, 10);
                    const numberComparison = aNumber - bNumber;
                    if (numberComparison !== 0) return numberComparison;
                }
            }

            // Lexicographical comparison of character parts
            return aCharPart.localeCompare(bCharPart);
        });
    }
}
