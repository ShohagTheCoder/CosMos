import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from 'src/accounts/schemas/account.schema';
import { Purchase } from 'src/schemas/purchase.schema';
import { Sell } from 'src/sells/schemas/sell.schema';
import { Stock } from 'src/stocks/schemas/stock.schema';
import { Transaction } from 'src/transactions/schemas/transaction.schema';
import { Trash } from 'src/trash/schemas/trash.schema';

@Injectable()
export class ClearService {
    constructor(
        @InjectModel(Sell.name) private sellModel: Model<Sell>,
        @InjectModel(Transaction.name)
        private transactionModel: Model<Transaction>,
        @InjectModel(Account.name) private accountModel: Model<Account>,
        @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
        @InjectModel(Stock.name) private stockModel: Model<Stock>,
        @InjectModel(Trash.name) private trashModel: Model<Trash>,
    ) {}

    async clear() {
        try {
            // 1. Delete all sells
            await this.sellModel.deleteMany({});

            // 2. Delete all transactions
            await this.transactionModel.deleteMany({});

            // 3. Set account balance to 0 for all accounts
            await this.accountModel.updateMany({}, { $set: { balance: 0 } });

            // 4. Clear all purchases
            await this.purchaseModel.deleteMany({});

            // 5. Set stock quantity to 0 for all items
            await this.stockModel.updateMany({}, { $set: { stock: 0 } });

            // 6. Clear all purchases
            await this.trashModel.deleteMany({});

            return {
                status: 'success',
                message: 'All data cleared successfully!',
            };
        } catch (error) {
            return {
                status: 'error',
                message: 'An error occurred while clearing data',
                error,
            };
        }
    }
}
