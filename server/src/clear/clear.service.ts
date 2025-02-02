import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from 'src/accounts/schemas/account.schema';
import { Command } from 'src/commands/schemas/command.schema';
import { Customer } from 'src/customers/schemas/customer.schema';
import { Purchase } from 'src/schemas/purchase.schema';
import { Sell } from 'src/sells/schemas/sell.schema';
import { Stock } from 'src/stocks/schemas/stock.schema';
import { Transaction } from 'src/transactions/schemas/transaction.schema';
import { Trash } from 'src/trash/schemas/trash.schema';
import { User } from 'src/users/schemas/user.schema';

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
        @InjectModel(Customer.name) private customerModel: Model<Customer>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Command.name) private commandModel: Model<User>,
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

            // 6. Clear all purchases
            await this.customerModel.deleteMany({});

            // 7. Clear all purchases
            await this.userModel.deleteMany({});

            // 8. Clear all purchases
            await this.commandModel.deleteMany({});

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
