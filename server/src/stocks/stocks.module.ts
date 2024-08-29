import { Module } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Stock, StockSchema } from './schemas/stocks.schema';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Stock.name, schema: StockSchema },
            { name: Product.name, schema: ProductSchema },
        ]),
    ],
    controllers: [StocksController],
    providers: [StocksService],
})
export class StocksModule {}
