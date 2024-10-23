import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { Model } from 'mongoose';
import { Response } from 'src/common/utils/apiResponse';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel(Transaction.name)
        private transactionModel: Model<TransactionDocument>,
    ) {}

    async create(createTransactionDto: any) {
        try {
            const account = new this.transactionModel(createTransactionDto);
            return await account.save();
        } catch (error) {
            throw new Error('Account faild');
        }
    }

    async countDocuments() {
        return await this.transactionModel.countDocuments();
    }

    async findAll() {
        try {
            const transactions = await this.transactionModel
                .find()
                .sort({ _id: -1 });
            return { status: 'success', data: transactions };
        } catch (error) {
            throw error;
        }
    }

    async findByQuery({
        page = 1,
        limit = 100,
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
        const totalDocuments =
            await this.transactionModel.countDocuments(query);

        // Fetch the paginated and filtered products
        const transactions = await this.transactionModel
            .find(query)
            .skip(skip)
            .limit(limitNumber)
            .exec();

        // Return the structured response with pagination details at the same level
        const response = new Response(
            'Tratransactions retrieved successfully',
        ).data(transactions);

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

    findOne(id: string) {
        return this.transactionModel.findById(id);
    }
}
