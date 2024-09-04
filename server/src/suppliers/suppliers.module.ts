import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier, SupplierSchema } from './schemas/supplier.schema';
import { Trash, TrashSchema } from 'src/trash/schemas/trash.schema';
import { TrashService } from 'src/trash/trash.service';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';
import { Account, AccountSchema } from 'src/accounts/schemas/account.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Supplier.name, schema: SupplierSchema },
            { name: Trash.name, schema: TrashSchema },
            { name: Product.name, schema: ProductSchema },
            { name: Account.name, schema: AccountSchema },
        ]),
    ],
    controllers: [SuppliersController],
    providers: [SuppliersService, TrashService],
})
export class SuppliersModule {}
