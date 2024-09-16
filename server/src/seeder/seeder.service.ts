import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import products from './date/products';
import commands from './date/commands';
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
        await this.seedCommands(); // Make sure to seed commands
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

    async seedCommands() {
        const count = await this.commandModel.countDocuments();

        if (count > 0) {
            this.logger.log('Seeding skipped, commands already exists');
            return;
        }

        try {
            const updatePromises = commands.map((item: any) =>
                this.commandModel.create(item),
            );
            await Promise.all(updatePromises);
            this.logger.log('Seeding Commands completed');
        } catch (error) {
            this.logger.error('Failed to seed Commands', error);
        }
    }
}
