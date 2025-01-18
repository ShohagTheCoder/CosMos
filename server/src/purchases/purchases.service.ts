import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { StocksService } from 'src/stocks/stocks.service';
import { InjectModel } from '@nestjs/mongoose';
import { Purchase, PurchaseDocument } from '../schemas/purchase.schema';
import { Model } from 'mongoose';
import { AccountsService } from 'src/accounts/accounts.service';
import { UsersService } from 'src/users/users.service';
import { Response } from 'src/common/utils/apiResponse';

@Injectable()
export class PurchasesService {
    constructor(
        @InjectModel(Purchase.name)
        private purchaseModel: Model<PurchaseDocument>,
        private stocksService: StocksService,
        private accountsService: AccountsService,
        private usersService: UsersService,
    ) {}

    async create(createPurchaseDto: CreatePurchaseDto) {
        try {
            const shop = await this.usersService.findShop();
            if (!shop) {
                throw new Error('Shop not found to exicute sell');
                return;
            }
            if (Object.keys(createPurchaseDto.products).length == 0) {
                if (createPurchaseDto.supplier == undefined) {
                    throw new Error('Purchase is empty');
                    return;
                }
            }

            // Update stock for each product in cart
            for (const product of Object.values(createPurchaseDto.products)) {
                await this.stocksService.updateStockQuantityUp(
                    product._id.toString(),
                    product.count,
                );
            }

            // Create and save the new sell
            const createdPurchase = new this.purchaseModel(createPurchaseDto);

            // Create transaction from user to cart for sell's paid
            const cartToUser = await this.accountsService.sendMoney({
                senderId: shop.account,
                receiverId: createPurchaseDto.user.account,
                amount: createPurchaseDto.totalPrice,
                action: 'purchase',
                note: createPurchaseDto.note,
            });

            createdPurchase.transaction = cartToUser._id.toString();

            return {
                status: 'success',
                data: await createdPurchase.save(),
                message: 'Purchase complete',
            };
        } catch (error) {
            // Handle errors appropriately
            throw new Error(error); // Re-throw the error or handle it as needed
        }
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
        const totalDocuments = await this.purchaseModel.countDocuments(query);

        // Fetch the paginated and filtered products
        const purchases = await this.purchaseModel
            .find(query)
            .skip(skip)
            .limit(limitNumber)
            .exec();

        // Return the structured response with pagination details at the same level
        const response = new Response('Purchases retrieved successfully').data(
            purchases,
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

    async findAll() {
        return await this.purchaseModel.find();
    }

    async findOne(id: number) {
        return await this.purchaseModel.findById(id);
    }

    async update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
        try {
            const updatedPurchase = await this.purchaseModel.findByIdAndUpdate(
                id,
                updatePurchaseDto,
                { new: true },
            );
            return updatedPurchase;
        } catch (error) {
            // Handle the error appropriately
            throw error;
        }
    }

    remove(id: number) {
        return `This action removes a #${id} purchase`;
    }
}
