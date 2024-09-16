import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { Command, CommandSchema } from '../commands/schemas/command.schema';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/CosMos'),
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
            { name: Command.name, schema: CommandSchema },
        ]),
    ],
    providers: [SeederService],
})
export class SeederModule {}
