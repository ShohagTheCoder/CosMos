import { Module } from '@nestjs/common';
import { TrashService } from './trash.service';
import { TrashController } from './trash.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Trash, TrashSchema } from './schemas/trash.schema';
import {
    Product,
    ProductSchema,
} from 'src/products/dto/schemas/product.schema';
import {
    Supplier,
    SupplierSchema,
} from 'src/suppliers/schemas/supplier.schema';
import { Stock, StockSchema } from 'src/stocks/schemas/stock.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Trash.name, schema: TrashSchema },
            { name: Product.name, schema: ProductSchema },
            { name: Supplier.name, schema: SupplierSchema },
            { name: Stock.name, schema: StockSchema },
        ]),
    ],
    controllers: [TrashController],
    providers: [TrashService],
})
export class TrashModule {}
