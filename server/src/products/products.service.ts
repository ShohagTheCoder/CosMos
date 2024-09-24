import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Price, Product, ProductDocument } from './schemas/product.schema';
import { Stock, StockDocument } from 'src/stocks/schemas/stocks.schema';
import { TrashService } from 'src/trash/trash.service';
import { Response } from 'src/common/utils/apiResponse';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<ProductDocument>,
        @InjectModel(Stock.name)
        private readonly stockModel: Model<StockDocument>,
        private trashService: TrashService,
    ) {}

    async findAll() {
        try {
            return await this.productModel
                .find()
                .select('-purchasePrices -purchaseMeasurements') // Exclude purchasePrices and purchaseMeasurements
                .populate('stock') // Populate stock field
                .populate('brand') // Populate brand field
                .populate('category') // Populate category field
                .exec();
        } catch (error) {
            console.error('Error finding products:', error);
            throw error;
        }
    }

    async findAllForPurchase() {
        try {
            return await this.productModel.find().populate('stock').exec();
        } catch (error) {
            console.error('Error finding products for purchase:', error);
            throw error;
        }
    }

    findOne(id: string) {
        return this.productModel.findById(id);
    }

    create(createProductDto: any) {
        const stockDto: any = {
            SKU: createProductDto.SKU, // Ensure SKU is part of CreateProductDto
            name: createProductDto.name,
            stock: createProductDto.purchaseEnable ? 100 : 0,
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

    async updatePrice(id: string, updatePrice: { amount: number }) {
        const product = await this.productModel.findById(id);

        if (product) {
            // Update prices by mapping over each price item
            product.prices = product.prices.map((item: Price) => ({
                ...item,
                price: item.price + updatePrice.amount,
            }));

            // Save and return the updated product
            await product.save();

            return new Response('Product price updated successfully')
                .data({
                    prices: { ...product.prices },
                })
                .done();
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
        const stock = await this.stockModel.findById(product.stock);
        if (!stock) {
            throw new Error('Product stock not found');
        }

        // Move the product to the trash before deleting
        await this.trashService.trashGroup([
            { source: Product.name, data: product },
            { source: Stock.name, data: stock },
        ]);

        // Delete the product and return the result
        await stock.deleteOne();
        return await product.deleteOne();
    }
}
