import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier, SupplierSchema } from './schemas/supplier.schema';
import { Trash, TrashSchema } from 'src/trash/schemas/trash.schema';
import { TrashService } from 'src/trash/trash.service';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Supplier.name, schema: SupplierSchema },
            { name: Trash.name, schema: TrashSchema },
            { name: Product.name, schema: ProductSchema },
        ]),
    ],
    controllers: [SuppliersController],
    providers: [SuppliersService, TrashService],
})
export class SuppliersModule {}
