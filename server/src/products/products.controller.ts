import {
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
    Put,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SellerGuard } from 'src/auth/guards/seller.guard';

// @UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    // @UseGuards(SellerGuard)
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
        return this.productsService.create(createProductDto);
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
