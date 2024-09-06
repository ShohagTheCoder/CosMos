import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/products/schemas/product.schema';

@Injectable()
export class SeederService {
    private readonly logger = new Logger(SeederService.name);

    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<ProductDocument>,
    ) {}

    async seed() {
        const count = await this.productModel.countDocuments();

        if (count > 0) {
            this.logger.log('Seeding skipped, data already exists');
            return;
        }
        await this.seedProducts();
    }

    async seedProducts() {
        const data = [
            { name: 'Sample 1', description: 'Description 1' },
            { name: 'Sample 2', description: 'Description 2' },
        ];

        try {
            for (const item of data) {
                await this.productModel.updateOne({ name: item.name }, item, {
                    upsert: true,
                });
            }
            this.logger.log('Seeding YourEntity completed');
        } catch (error) {
            this.logger.error('Failed to seed YourEntity', error);
        }
    }
}
