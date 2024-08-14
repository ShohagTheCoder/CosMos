import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
} from '@nestjs/common';
import { SellsService } from './sells.service';
import { Sell } from './interfaces/sell.interface';

@Controller('sells')
export class SellsController {
    constructor(private readonly sellsService: SellsService) {}

    @Post()
    async create(@Body() createSellDto: Sell): Promise<Sell> {
        return this.sellsService.create(createSellDto);
    }

    @Get()
    async findAll(): Promise<Sell[]> {
        return this.sellsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Sell> {
        return this.sellsService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateSellDto: Partial<Sell>,
    ): Promise<Sell> {
        return this.sellsService.update(id, updateSellDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<any> {
        return this.sellsService.remove(id);
    }
}
