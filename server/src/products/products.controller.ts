import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Post()
    async create(@Body() createProductDto: any) {
        const createdProduct =
            await this.productsService.create(createProductDto);

        if (createdProduct) {
            // await this.productsService.createStock(createProductDto.stock);
        }

        return createdProduct;
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateProductDto: any) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.productsService.delete(id);
    }
}
