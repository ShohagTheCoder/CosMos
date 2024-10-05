import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
        const data = await this.productModel
            .find()
            .select('-purchasePrices -purchaseMeasurements') // Exclude certain fields
            .populate('stock')
            .populate('brand')
            .populate('category')
            .exec();
        return new Response('Here is all products').data(data).done();
    }

    async countDocuments() {
        return await this.productModel.countDocuments();
    }

    async findByQuery({
        page = 1,
        limit = 10,
        startDate,
        endDate,
        ...otherFilters
    }: {
        page?: string | number;
        limit?: string | number;
        startDate?: Date | string;
        endDate?: Date | string;
        [key: string]: any;
    }) {
        // Convert page and limit to numbers if they are strings and ensure minimum values
        const pageNumber = Math.max(
            1,
            typeof page === 'string' ? parseInt(page, 10) : page,
        );
        const limitNumber = Math.max(
            1,
            typeof limit === 'string' ? parseInt(limit, 10) : limit,
        );
        const skip = (pageNumber - 1) * limitNumber;

        // Build the base query object
        const query: any = {};

        // Convert startDate and endDate strings to Date objects if needed
        if (typeof startDate === 'string') {
            startDate = new Date(startDate);
            startDate.setHours(0, 0, 0, 0); // Set startDate to 00:00:00
        }
        if (typeof endDate === 'string') {
            endDate = new Date(endDate);
            endDate.setHours(23, 59, 59, 999); // Set endDate to 23:59:59
        }

        // Apply date-based filters if provided
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = startDate; // Greater than or equal to startDate
            }
            if (endDate) {
                query.createdAt.$lte = endDate; // Less than or equal to endDate
            }
            if (Object.keys(query.createdAt).length === 0) {
                delete query.createdAt; // Remove empty date filter
            }
        }

        // Merge additional filters if any are provided and are valid objects
        if (otherFilters && typeof otherFilters === 'object') {
            Object.assign(query, otherFilters);
        }

        // Fetch the total document count matching the query
        const totalDocuments = await this.productModel.countDocuments(query);

        // Fetch the paginated and filtered products with selected fields and populated relations
        const products = await this.productModel
            .find(query)
            .skip(skip)
            .limit(limitNumber)
            .select('-purchasePrices -purchaseMeasurements') // Exclude certain fields
            .populate('stock') // Populate 'stock' field
            .populate('brand') // Populate 'brand' field
            .populate('category') // Populate 'category' field
            .exec();

        // Return the structured response with pagination details
        const response = new Response('Products retrieved successfully').data(
            products,
        );

        // Conditionally add pagination details if available
        if (totalDocuments) {
            response
                .page(pageNumber)
                .limit(limitNumber)
                .totalDocuments(totalDocuments)
                .totalPages(Math.ceil(totalDocuments / limitNumber));
        }

        return response.done();
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
            stock: 0,
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
                    prices: product.prices,
                })
                .done();
        }

        throw new Error('Product not found for id ' + id);
    }
    async updatePurchasePrice(id: string, updatePrice: { amount: number }) {
        const product = await this.productModel.findById(id);

        if (product) {
            // Update prices by mapping over each price item
            product.purchasePrices = product.purchasePrices.map(
                (item: Price) => ({
                    ...item,
                    price: item.price + updatePrice.amount,
                }),
            );

            // Save and return the updated product
            await product.save();

            return new Response('Product purchase price updated successfully')
                .data({
                    prices: product.purchasePrices,
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
        await this.trashService.trash([
            { source: Product.name, data: product },
            { source: Stock.name, data: stock },
        ]);

        // Delete the product and return the result
        await stock.deleteOne();
        return await product.deleteOne();
    }
}
