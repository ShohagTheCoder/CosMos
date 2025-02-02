import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './dto/schemas/product.schema';
import { Stock, StockSchema } from 'src/stocks/schemas/stock.schema';
import { TrashService } from 'src/trash/trash.service';
import { Trash, TrashSchema } from 'src/trash/schemas/trash.schema';
import {
    Supplier,
    SupplierSchema,
} from 'src/suppliers/schemas/supplier.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
            { name: Stock.name, schema: StockSchema },
            { name: Trash.name, schema: TrashSchema },
            { name: Supplier.name, schema: SupplierSchema },
        ]),
    ],
    controllers: [ProductsController],
    providers: [ProductsService, TrashService],
})
export class ProductsModule {}
