import { Module } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StockSchema } from './schemas/stocks.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Stock', schema: StockSchema }]),
    ],
    controllers: [StocksController],
    providers: [StocksService],
})
export class StocksModule {}
