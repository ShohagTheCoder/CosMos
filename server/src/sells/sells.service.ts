import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sell, SellDocument } from './schemas/sell.schema';
import { CreateSellDto } from './dto/create-sell.dto';
import { AccountsService } from 'src/accounts/accounts.service';
import { StocksService } from 'src/stocks/stocks.service';
import { UsersService } from 'src/users/users.service';
import { Product, ProductDocument } from 'src/products/schemas/product.schema';
import { Response } from 'src/common/utils/apiResponse';

@Injectable()
export class SellsService {
    constructor(
        @InjectModel(Sell.name) private sellModel: Model<SellDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        private accountsService: AccountsService,
        private stocksService: StocksService,
        private usersService: UsersService,
    ) {}

    findAll() {
        return this.sellModel.find();
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
        // Convert page and limit to numbers if they are strings
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

        // Merge additional filters if any are provided
        if (otherFilters && typeof otherFilters === 'object') {
            Object.assign(query, otherFilters);
        }

        // Fetch the total document count matching the query
        const totalDocuments = await this.sellModel.countDocuments(query);

        // Fetch the paginated and filtered products
        const sells = await this.sellModel
            .find(query)
            .skip(skip)
            .limit(limitNumber)
            .exec();

        // Return the structured response with pagination details at the same level
        const response = new Response('Sells retrieved successfully').data(
            sells,
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

    findByUser(id: string) {
        return this.sellModel.find({
            'user._id': id,
        });
    }

    findByCustomer(id: string) {
        return this.sellModel.find({
            'customer._id': id,
        });
    }

    async findOne(id: string) {
        return await this.sellModel.findById(id).exec();
    }

    async create(createSellDto: CreateSellDto) {
        try {
            const shop = await this.usersService.findShop();

            if (!shop) {
                throw new Error('Shop not found to exicute sell');
                return;
            }

            if (Object.keys(createSellDto.products).length == 0) {
                if (createSellDto.customer == undefined) {
                    throw new Error('Sell is emty');
                    return;
                }
            }

            if (!createSellDto.customer) {
                createSellDto.paid = createSellDto.totalPrice;
                createSellDto.due = 0;
            }

            // Update stock for each product in cart
            for (const product of Object.values(createSellDto.products)) {
                if (product.purchaseEnable) {
                    await this.stocksService.updateStockQuantity(
                        product._id.toString(),
                        product.count,
                    );
                }
            }

            // Create and save the new sell
            const createdSell = new this.sellModel(createSellDto);

            // Create transaction from user to cart for sell's paid
            const userToCart = await this.accountsService.sendMoney({
                senderId: createSellDto.user.account,
                receiverId: shop.account,
                amount: createSellDto.paid,
                action: 'sells',
                note: createSellDto.note,
            });

            createdSell.paidTransaction = userToCart._id.toString();

            // Create transaction for sell from customer to cart if the sell has due
            if (createSellDto.due > 0 && createSellDto.customer) {
                const customerToCart = await this.accountsService.sendMoney({
                    senderId: createSellDto.customer.account,
                    receiverId: shop.account,
                    amount: createSellDto.due,
                    action: 'sells due',
                    note: createSellDto.note,
                });

                createdSell.dueTransaction = customerToCart._id.toString();
            }

            return {
                status: 'success',
                data: await createdSell.save(),
                message: 'Sell complete',
            };
        } catch (error) {
            // Handle errors appropriately
            console.error('Error creating sell:', error);
            throw error; // Re-throw the error or handle it as needed
        }
    }

    update(id: string, updateSellDto: any) {
        return this.sellModel.findByIdAndUpdate(id, updateSellDto);
    }

    async remove(id: string) {
        try {
            await this.sellModel.findByIdAndDelete(id);
            return {
                status: 'success',
                message: 'Sell deleted successfully',
                data: null,
            };
        } catch (error) {
            throw error;
        }
    }
}
