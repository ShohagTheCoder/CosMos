import { Module } from '@nestjs/common';
import { SellsController } from './sells.controller';
import { SellsService } from './sells.service';
import { Sell, SellSchema } from './schemas/sell.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Stock, StockSchema } from 'src/stocks/schemas/stock.schema';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account, AccountSchema } from 'src/accounts/schemas/account.schema';
import {
    Transaction,
    TransactionSchema,
} from 'src/transactions/schemas/transaction.schema';
import {
    Product,
    ProductSchema,
} from 'src/products/dto/schemas/product.schema';
import { StocksService } from 'src/stocks/stocks.service';
import { Setting, SettingSchema } from 'src/settings/schemas/setting.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Sell.name, schema: SellSchema },
            { name: Stock.name, schema: StockSchema },
            { name: Account.name, schema: AccountSchema },
            { name: Transaction.name, schema: TransactionSchema },
            { name: Product.name, schema: ProductSchema },
            { name: User.name, schema: UserSchema },
            { name: Setting.name, schema: SettingSchema },
        ]),
    ],
    controllers: [SellsController],
    providers: [SellsService, AccountsService, StocksService, UsersService],
})
export class SellsModule {}
