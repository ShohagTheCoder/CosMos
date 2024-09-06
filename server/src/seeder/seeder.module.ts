import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
        ]),
    ],
    providers: [SeederService],
})
export class SeederModule {}
