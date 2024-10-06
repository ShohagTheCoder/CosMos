import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { Permissions } from 'src/auth/guards/permissions';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Permissions('sale')
    @Get('forPurchase')
    async findAllForPurchase() {
        return await this.productsService.findAllForPurchase();
    }

    @Permissions('sale')
    @Get()
    async findAll() {
        return await this.productsService.findAll();
    }

    @Permissions('sale')
    @Get('countDocuments')
    async countDocuments() {
        return await this.productsService.countDocuments();
    }

    @Permissions('sale')
    @Get('query')
    async findByQuery(@Query() query: any) {
        return await this.productsService.findByQuery(query);
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
