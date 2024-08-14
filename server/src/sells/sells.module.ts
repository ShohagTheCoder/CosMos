import { Module } from '@nestjs/common';
import { SellsController } from './sells.controller';
import { SellsService } from './sells.service';
import { SellSchema } from './schemas/sell.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Sell', schema: SellSchema }]),
    ],
    controllers: [SellsController],
    providers: [SellsService],
})
export class SellsModule {}
