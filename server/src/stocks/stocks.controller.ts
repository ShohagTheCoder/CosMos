import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { StocksService } from './stocks.service'; // Adjust the path as necessary
import { CreateStockDto } from './dto/CreateStockDto';
import { UpdateStockDto } from './dto/UpdateStockDto';

@Controller('stocks')
export class StocksController {
    constructor(private readonly stocksService: StocksService) {}

    @Get()
    findAll() {
        return this.stocksService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.stocksService.findOne(id);
    }

    @Post()
    create(@Body() createStockDto: CreateStockDto) {
        return this.stocksService.create(createStockDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
        return this.stocksService.update(id, updateStockDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.stocksService.delete(id);
    }
}
