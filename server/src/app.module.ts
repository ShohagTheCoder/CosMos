import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SellsModule } from './sells/sells.module';
import { CustomersModule } from './customers/customers.module';
import { UsersModule } from './users/users.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { StocksModule } from './stocks/stocks.module';
import { PurchasesModule } from './purchases/purchases.module';
import { BrandsModule } from './brands/brands.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AccountsModule } from './accounts/accounts.module';
import { TrashModule } from './trash/trash.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/CosMos'),
        ProductsModule,
        SellsModule,
        CustomersModule,
        UsersModule,
        SuppliersModule,
        StocksModule,
        PurchasesModule,
        BrandsModule,
        TransactionsModule,
        AccountsModule,
        TrashModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
