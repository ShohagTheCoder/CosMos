import { Module } from '@nestjs/common';
import { SellsController } from './sells.controller';
import { SellsService } from './sells.service';
import { SellSchema } from './schemas/sell.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StockSchema } from 'src/stocks/schemas/stocks.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Sell', schema: SellSchema },
            { name: 'Stock', schema: StockSchema },
        ]),
    ],
    controllers: [SellsController],
    providers: [SellsService],
})
export class SellsModule {}
