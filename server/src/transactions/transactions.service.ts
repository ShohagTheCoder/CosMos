import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { Model } from 'mongoose';

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

    findOne(id: string) {
        return this.transactionModel.findById(id);
    }
}
