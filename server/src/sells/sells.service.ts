import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock, StockDocument } from 'src/stocks/schemas/stocks.schema';
import { Sell, SellDocument } from './schemas/sell.schema';
import { CreateSellDto } from './dto/create-sell.dto';
import { AccountsService } from 'src/accounts/accounts.service';

const CART_ID = '66c6db894bf58c000a9d261f';

@Injectable()
export class SellsService {
    constructor(
        @InjectModel(Sell.name) private sellModel: Model<SellDocument>,
        @InjectModel(Stock.name)
        private stockModel: Model<StockDocument>,
        private accountsService: AccountsService,
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
            for (const product of Object.values(createSellDto.products)) {
                const stock = await this.stockModel.findById(product.stock);
                if (!stock) {
                    throw new Error(`Stock with ID ${product.stock} not found`);
                }
                stock.stock -= product.count;
                await stock.save();
            }

            // Create and save the new sell
            const createdSell = new this.sellModel(createSellDto);

            // Create transaction for sell
            const userToCart = await this.accountsService.sendMoney({
                senderId: createSellDto.user._id,
                receiverId: '66c6d8a0b0f83bdb4ed36c97',
                amount: createSellDto.paid,
                action: 'purchase',
                note: createSellDto.note,
            });

            createdSell.paidTransaction = userToCart._id.toString();

            if (createSellDto.due > 0) {
                // Create transaction for sell
                const customerToCart = await this.accountsService.sendMoney({
                    senderId: '66c6ed65b0f83bdb4ed36cb3',
                    receiverId: '66c6d8a0b0f83bdb4ed36c97',
                    amount: createSellDto.due,
                    action: 'sells',
                    note: createSellDto.note,
                });

                createdSell.dueTransaction = customerToCart._id.toString();
            }

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
