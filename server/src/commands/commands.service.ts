import { Injectable } from '@nestjs/common';

@Injectable()
export class CommandsService {
    findAll() {
        return `This action returns all commands`;
    }

    findOne(id: string) {
        return `This action returns a #${id} command`;
    }

    update(id: string, updateCommandDto) {
        return `This action updates a #${id} command`;
    }
}
