import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sell } from './interfaces/sell.interface';
import { Model } from 'mongoose';

@Injectable()
export class SellsService {
    constructor(@InjectModel('Sell') private readonly sellModel: Model<Sell>) {}

    findAll() {
        return this.sellModel.find();
    }

    findOne(id: string) {
        return this.sellModel.findById(id);
    }

    create(createSellDto: any) {
        const createdSell = new this.sellModel(createSellDto);
        return createdSell.save();
    }

    update(id: string, updateSellDto: any) {
        return this.sellModel.findByIdAndUpdate(id, updateSellDto);
    }

    remove(id: string) {
        return this.sellModel.findByIdAndDelete(id);
    }
}
