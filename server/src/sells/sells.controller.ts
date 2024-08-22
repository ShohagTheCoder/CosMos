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
import { CreateSellDto } from './dto/create-sell.dto';

@Controller('sells')
export class SellsController {
    constructor(private readonly sellsService: SellsService) {}

    @Post()
    async create(@Body() createSellDto: any) {
        // console.log(createSellDto);
        // return;
        return this.sellsService.create(createSellDto);
    }

    @Get()
    async findAll() {
        return this.sellsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.sellsService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateSellDto: CreateSellDto,
    ) {
        return this.sellsService.update(id, updateSellDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<any> {
        return this.sellsService.remove(id);
    }
}
