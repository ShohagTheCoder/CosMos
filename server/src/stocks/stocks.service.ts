import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock, StockDocument } from './schemas/stocks.schema'; // Adjust the path if necessary
import { CreateStockDto } from './dto/CreateStockDto'; // Adjust the path if necessary
import { UpdateStockDto } from './dto/UpdateStockDto'; // Adjust the path if necessary
import { Product, ProductDocument } from 'src/products/schemas/product.schema';

@Injectable()
export class StocksService {
    constructor(
        @InjectModel(Stock.name)
        private readonly stockModel: Model<StockDocument>,
        @InjectModel(Product.name)
        private readonly productModel: Model<ProductDocument>,
    ) {}

    async findAll(): Promise<Stock[]> {
        return this.stockModel.find().exec();
    }

    async updateStockQuantity(productId: string, count: number): Promise<void> {
        const product = await this.productModel.findById(productId).exec();
        const stock = await this.stockModel.findById(product.stock).exec();

        if (!product || !stock) {
            throw new NotFoundException(
                `Product with ID ${productId} not found.`,
            );
        }

        // Decrease the stock of the current product
        stock.stock -= count;
        await stock.save();

        // Recursively decrease the stock of each resource
        if (product.hasResources) {
            for (const resource of Object.values(product.resources)) {
                await this.updateStockQuantity(
                    resource._id.toString(),
                    resource.count * count,
                );
            }
        }
    }

    async findOne(id: string): Promise<Stock> {
        return this.stockModel.findById(id).exec();
    }

    async create(createStockDto: CreateStockDto): Promise<Stock> {
        const createdStock = new this.stockModel(createStockDto);
        return createdStock.save();
    }

    async update(id: string, updateStockDto: UpdateStockDto): Promise<Stock> {
        return this.stockModel
            .findByIdAndUpdate(id, updateStockDto, { new: true })
            .exec();
    }

    async delete(id: string): Promise<Stock> {
        return this.stockModel.findByIdAndDelete(id).exec();
    }
}
