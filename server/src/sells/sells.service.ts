import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock } from 'src/stocks/schemas/stocks.schema';
import { Sell, SellDocument } from './schemas/sell.schema';
import { CreateSellDto } from './dto/create-sell.dto';
import { AccountsService } from 'src/accounts/accounts.service';
import { StocksService } from 'src/stocks/stocks.service';

@Injectable()
export class SellsService {
    constructor(
        @InjectModel(Sell.name) private sellModel: Model<SellDocument>,
        @InjectModel(Stock.name)
        private accountsService: AccountsService,
        private stocksService: StocksService,
    ) {}

    findAll() {
        return this.sellModel.find();
    }

    findByCustomer(id: string) {
        return this.sellModel.find({
            'customer._id': id,
        });
    }

    async findOne(id: string) {
        return await this.sellModel.findById(id).exec();
    }

    async create(createSellDto: CreateSellDto) {
        try {
            // Update stock for each product in cart
            for (const product of Object.values(createSellDto.products)) {
                await this.stocksService.updateStockQuantity(
                    product._id.toString(),
                    product.count,
                );
            }

            // Create and save the new sell
            const createdSell = new this.sellModel(createSellDto);

            // Create transaction from user to cart for sell's paid
            const userToCart = await this.accountsService.sendMoney({
                senderId: createSellDto.user.account,
                receiverId: '66c6d8a0b0f83bdb4ed36c97',
                amount: createSellDto.paid,
                action: 'sells',
                note: createSellDto.note,
            });

            createdSell.paidTransaction = userToCart._id.toString();

            // Create transaction for sell from customer to cart if the sell has due
            if (createSellDto.due > 0 && createSellDto.customer) {
                const customerToCart = await this.accountsService.sendMoney({
                    senderId: createSellDto.customer.account,
                    receiverId: '66c6d8a0b0f83bdb4ed36c97',
                    amount: createSellDto.due,
                    action: 'sells due',
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
