import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';

// @UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    // @UseGuards(SellerGuard)
    @Get()
    async findAll() {
        return await this.productsService.findAll();
    }

    // @UseGuards(SellerGuard)
    @Get('for-purchase')
    async findAllForPurchase() {
        return await this.productsService.findAllForPurchase();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Post()
    async create(@Body() createProductDto: any) {
        return this.productsService.create(createProductDto);
    }

    @Patch('/updatePrice/:id')
    updatePrice(
        @Param('id') id: string,
        @Body() updatePrice: { amount: number },
    ) {
        return this.productsService.updatePrice(id, updatePrice);
    }

    @Patch('/updatePurchasePrice/:id')
    updatePurchasePrice(
        @Param('id') id: string,
        @Body() updatePrice: { amount: number },
    ) {
        return this.productsService.updatePurchasePrice(id, updatePrice);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProductDto: any) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
