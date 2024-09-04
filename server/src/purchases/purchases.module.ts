import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Purchase, PurchaseSchema } from '../schemas/purchase.schema';
import { StocksService } from 'src/stocks/stocks.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { Stock, StockSchema } from 'src/stocks/schemas/stocks.schema';
import { Account, AccountSchema } from 'src/accounts/schemas/account.schema';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';
import {
    Transaction,
    TransactionSchema,
} from 'src/transactions/schemas/transaction.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Purchase.name, schema: PurchaseSchema },
            { name: Stock.name, schema: StockSchema },
            { name: Account.name, schema: AccountSchema },
            { name: Product.name, schema: ProductSchema },
            { name: Transaction.name, schema: TransactionSchema },
        ]),
    ],
    controllers: [PurchasesController],
    providers: [PurchasesService, StocksService, AccountsService],
})
export class PurchasesModule {}
