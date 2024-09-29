import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import products from './date/products';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Command, CommandDocument } from '../commands/schemas/command.schema';

@Injectable()
export class SeederService {
    private readonly logger = new Logger(SeederService.name);

    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<ProductDocument>,
        @InjectModel(Command.name)
        private readonly commandModel: Model<CommandDocument>,
    ) {}

    async seed() {
        await this.seedProducts();
    }

    async seedProducts() {
        const count = await this.productModel.countDocuments();

        if (count > 0) {
            this.logger.log('Seeding skipped, products already exists');
            return;
        }

        try {
            const createPromises = products.map((item: any) =>
                this.productModel.create(item),
            );
            await Promise.all(createPromises);
            this.logger.log('Seeding Products completed');
        } catch (error) {
            this.logger.error('Failed to seed Products', error);
        }
    }
}
