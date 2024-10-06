import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
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

    @Get('countDocuments')
    async countDocuments() {
        return await this.productsService.countDocuments();
    }

    @Get('query')
    async findByQuery(@Query() query: any) {
        return await this.productsService.findByQuery(query);
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

    @Post('createMany')
    createMany(@Body() createProductsDto: any) {
        return this.productsService.createMany(createProductsDto);
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

    @Delete('clearAll')
    clearAll() {
        return this.productsService.clearAll();
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
