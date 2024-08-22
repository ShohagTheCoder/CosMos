import { Module } from '@nestjs/common';
import { SellsController } from './sells.controller';
import { SellsService } from './sells.service';
import { Sell, SellSchema } from './schemas/sell.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Stock, StockSchema } from 'src/stocks/schemas/stocks.schema';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account, AccountSchema } from 'src/accounts/schemas/account.schema';
import {
    Transaction,
    TransactionSchema,
} from 'src/transactions/schemas/transaction.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Sell.name, schema: SellSchema },
            { name: Stock.name, schema: StockSchema },
            { name: Account.name, schema: AccountSchema },
            { name: Transaction.name, schema: TransactionSchema },
        ]),
    ],
    controllers: [SellsController],
    providers: [SellsService, AccountsService],
})
export class SellsModule {}
