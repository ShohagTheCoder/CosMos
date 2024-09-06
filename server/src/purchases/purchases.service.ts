import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { StocksService } from 'src/stocks/stocks.service';
import { InjectModel } from '@nestjs/mongoose';
import { Purchase, PurchaseDocument } from '../schemas/purchase.schema';
import { Model } from 'mongoose';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class PurchasesService {
    constructor(
        @InjectModel(Purchase.name)
        private purchaseModel: Model<PurchaseDocument>,
        private stocksService: StocksService,
        private accountsService: AccountsService,
    ) {}

    async create(createPurchaseDto: CreatePurchaseDto) {
        try {
            // Update stock for each product in cart
            for (const product of Object.values(createPurchaseDto.products)) {
                await this.stocksService.updateStockQuantityUp(
                    product._id.toString(),
                    product.count,
                );
            }

            // Create and save the new sell
            const createdPurchase = new this.purchaseModel(createPurchaseDto);

            // Create transaction from user to cart for sell's paid
            const cartToUser = await this.accountsService.sendMoney({
                senderId: '66c6d8a0b0f83bdb4ed36c97',
                receiverId: createPurchaseDto.receiver.account,
                amount: createPurchaseDto.totalPrice,
                action: 'purchase',
                note: createPurchaseDto.note,
            });

            createdPurchase.transaction = cartToUser._id.toString();

            return await createdPurchase.save();
        } catch (error) {
            // Handle errors appropriately
            console.error('Error creating purchase');
            throw Error('Faild to create purchase'); // Re-throw the error or handle it as needed
        }
    }

    findAll() {
        return `This action returns all purchases`;
    }

    findOne(id: number) {
        return `This action returns a #${id} purchase`;
    }

    async update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
        try {
            const updatedPurchase = await this.purchaseModel.findByIdAndUpdate(
                id,
                updatePurchaseDto,
                { new: true },
            );
            return updatedPurchase;
        } catch (error) {
            // Handle the error appropriately
            throw error;
        }
    }

    remove(id: number) {
        return `This action removes a #${id} purchase`;
    }
}
