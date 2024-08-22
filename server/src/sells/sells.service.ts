import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockDocument } from 'src/stocks/schemas/stocks.schema';
import { SellDocument } from './schemas/sell.schema';
import { CreateSellDto } from './dto/create-sell.dto';

@Injectable()
export class SellsService {
    constructor(
        @InjectModel('Sell') private readonly sellModel: Model<SellDocument>,
        @InjectModel('Stock') private readonly stockModel: Model<StockDocument>,
    ) {}

    findAll() {
        return this.sellModel.find();
    }

    findOne(id: string) {
        return this.sellModel.findById(id);
    }

    async create(createSellDto: CreateSellDto) {
        try {
            // Process each product in the cart
            for (const product of Object.values(createSellDto.cart)) {
                const stock = await this.stockModel.findById(product.stock);
                if (!stock) {
                    throw new Error(`Stock with ID ${product.stock} not found`);
                }
                stock.stock -= product.count;
                await stock.save();
            }

            // Create and save the new sell
            const createdSell = new this.sellModel(createSellDto);
            return await createdSell.save();
        } catch (error) {
            // Handle errors appropriately
            console.error('Error creating sell:', error);
            throw error; // Re-throw the error or handle it as needed
        }
    }

    update(id: string, updateSellDto: any) {
        return this.sellModel.findByIdAndUpdate(id, updateSellDto);
    }

    remove(id: string) {
        return this.sellModel.findByIdAndDelete(id);
    }
}
