import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Query,
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

    @Get('query')
    async findByQuery(@Query() query: any) {
        return await this.sellsService.findByQuery(query);
    }

    @Get('findByUser/:id')
    async findByUser(@Param('id') id: string) {
        return this.sellsService.findByUser(id);
    }

    @Get('findByCustomer/:id')
    async findByCustomer(@Param('id') id: string) {
        return this.sellsService.findByCustomer(id);
    }

    @Get()
    async findAll() {
        return this.sellsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        console.log(id);
        return await this.sellsService.findOne(id);
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
