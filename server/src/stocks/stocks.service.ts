import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock, StockDocument } from './schemas/stocks.schema'; // Adjust the path if necessary
import { CreateStockDto } from './dto/CreateStockDto'; // Adjust the path if necessary
import { UpdateStockDto } from './dto/UpdateStockDto'; // Adjust the path if necessary

@Injectable()
export class StocksService {
    constructor(
        @InjectModel(Stock.name)
        private readonly stockModel: Model<StockDocument>,
    ) {}

    async findAll(): Promise<Stock[]> {
        return this.stockModel.find().exec();
    }

    async findOne(id: string): Promise<Stock> {
        return this.stockModel.findById(id).exec();
    }

    async create(createStockDto: CreateStockDto): Promise<Stock> {
        const createdStock = new this.stockModel(createStockDto);
        return createdStock.save();
    }

    async update(id: string, updateStockDto: UpdateStockDto): Promise<Stock> {
        return this.stockModel
            .findByIdAndUpdate(id, updateStockDto, { new: true })
            .exec();
    }

    async delete(id: string): Promise<Stock> {
        return this.stockModel.findByIdAndDelete(id).exec();
    }
}
