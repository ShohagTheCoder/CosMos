import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClearService } from './clear.service';
import { ClearController } from './clear.controller';
import { Account, AccountSchema } from 'src/accounts/schemas/account.schema';
import { Purchase, PurchaseSchema } from 'src/schemas/purchase.schema';
import { Sell, SellSchema } from 'src/sells/schemas/sell.schema';
import { Stock, StockSchema } from 'src/stocks/schemas/stocks.schema';
import {
    Transaction,
    TransactionSchema,
} from 'src/transactions/schemas/transaction.schema';
import { Trash, TrashSchema } from 'src/trash/schemas/trash.schema';

@Module({
    imports: [
        // Register all schemas with Mongoose
        MongooseModule.forFeature([
            { name: Sell.name, schema: SellSchema },
            { name: Transaction.name, schema: TransactionSchema },
            { name: Account.name, schema: AccountSchema },
            { name: Purchase.name, schema: PurchaseSchema },
            { name: Stock.name, schema: StockSchema },
            { name: Trash.name, schema: TrashSchema },
        ]),
    ],
    providers: [ClearService],
    controllers: [ClearController],
})
export class ClearModule {}
