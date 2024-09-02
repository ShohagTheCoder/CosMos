import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Product } from './interfaces/product.interface';
// import { CreateProductDto } from './dto/CreateProductDto';
// import { UpdateProductDto } from './dto/UpdateProductDto';
import { Product, ProductDocument } from './schemas/product.schema';
import { StockDocument } from 'src/stocks/schemas/stocks.schema';
import { TrashService } from 'src/trash/trash.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel('Product')
        private readonly productModel: Model<ProductDocument>,
        @InjectModel('Stock')
        private readonly stockModel: Model<StockDocument>,
        private trashService: TrashService,
    ) {}

    findAll() {
        return this.productModel.find();
    }

    findOne(id: string) {
        return this.productModel.findById(id);
    }

    create(createProductDto: any) {
        const stockDto: any = {
            SKU: createProductDto.SKU, // Ensure SKU is part of CreateProductDto
            name: createProductDto.name,
            stock: 100,
            stockLow: createProductDto.stockLow,
            stockAlert: createProductDto.stockAlert,
            lastSupplier: 'Shohag Ahmed',
            lastReceiver: 'Shohag Ahmed',
            lastStockedDate: new Date(),
        };

        try {
            // Create and save the stock document
            const createdProduct = new this.productModel(createProductDto);
            const createdStock = new this.stockModel(stockDto);

            if (createdProduct && createdStock) {
                createdProduct.stock = createdStock._id.toString();
                createdStock.product = createdProduct._id.toString();

                createdStock.save();
                return createdProduct.save();
            } else {
                throw new HttpException(
                    'Product or stock creation failed',
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (error) {
            throw new HttpException(
                'An error occurred',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async update(id: string, updateProductDto: any) {
        const product = await this.productModel.findById(id);

        if (product) {
            Object.assign(product, updateProductDto);
            return product.save();
        }

        throw new Error('Product not found for id ' + id);
    }

    async remove(id: string) {
        // Find the product by its ID
        const product = await this.productModel.findById(id);

        // Handle the case where the product might not be found
        if (!product) {
            throw new Error('Product not found');
        }

        // Move the product to the trash before deleting
        await this.trashService.create(Product.name, product);

        // Delete the product and return the result
        return product.deleteOne();
    }
}
