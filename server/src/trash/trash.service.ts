import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trash, TrashDocument } from './schemas/trash.schema';
import { Product, ProductDocument } from 'src/products/schemas/product.schema';
import {
    Supplier,
    SupplierDocument,
} from 'src/suppliers/schemas/supplier.schema';
import { Stock, StockDocument } from 'src/stocks/schemas/stocks.schema';

interface TrashItem {
    source: string; // Collection name or identifier
    data: any; // Document data
}

@Injectable()
export class TrashService {
    constructor(
        @InjectModel(Trash.name) private trashModel: Model<TrashDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(Stock.name) private stockModel: Model<StockDocument>,
        @InjectModel(Supplier.name)
        private supplierModel: Model<SupplierDocument>,
    ) {}

    async trash(items: TrashItem[] | TrashItem): Promise<TrashDocument[]> {
        // Ensure items is always treated as an array
        const trashItemsArray = Array.isArray(items) ? items : [items];

        // If there's only one item, use its own ID as the connect value
        const connect =
            trashItemsArray.length > 1 ? trashItemsArray[0].data._id : null;

        const savedItems: TrashDocument[] = [];

        for (const item of trashItemsArray) {
            const trash = new this.trashModel({
                source: item.source,
                connect: connect || item.data._id, // Use `connect` for group or the item's own ID for single item
                data: item.data,
            });

            try {
                const savedItem = await trash.save();
                savedItems.push(savedItem);
            } catch (error) {
                throw new Error(
                    'Failed to save item to trash: ' + error.message,
                );
            }
        }

        return savedItems;
    }

    async restore(id: string): Promise<TrashDocument[]> {
        const trashItem = (await this.trashModel
            .findById(id)
            .exec()) as TrashDocument;

        if (!trashItem) {
            throw new Error('Trash item not found');
        }

        const { source, data, connect } = trashItem;
        const connectedItems = (await this.trashModel
            .find({ connect })
            .exec()) as TrashDocument[];
        const restoredItems: any[] = [];

        for (const item of connectedItems) {
            const restoredItem = this.getModelByName(item.source, item.data);

            try {
                await restoredItem.save();
                restoredItems.push(restoredItem);
            } catch (error) {
                throw new Error('Failed to restore item: ' + error.message);
            }

            await this.trashModel.findByIdAndDelete(item._id).exec();
        }

        return restoredItems;
    }

    // New remove method, similar to restore
    async remove(id: string): Promise<TrashDocument[]> {
        const trashItem = (await this.trashModel
            .findById(id)
            .exec()) as TrashDocument;

        if (!trashItem) {
            throw new Error('Trash item not found');
        }

        const { connect } = trashItem;
        const connectedItems = (await this.trashModel
            .find({ connect })
            .exec()) as TrashDocument[];

        const removedItems: TrashDocument[] = [];

        for (const item of connectedItems) {
            try {
                await this.trashModel.findByIdAndDelete(item._id).exec();
                removedItems.push(item);
            } catch (error) {
                throw new Error('Failed to remove item: ' + error.message);
            }
        }

        return removedItems;
    }

    // Improved findOne method to retrieve an item by its ID from trash
    async findOne(id: string): Promise<TrashDocument> {
        const trashItem = await this.trashModel.findById(id).exec();
        if (!trashItem) {
            throw new Error(`Trash item with id #${id} not found`);
        }
        return trashItem;
    }

    private getModelByName(source: string, data: any) {
        switch (source) {
            case Product.name:
                return new this.productModel(data);
            case Supplier.name:
                return new this.supplierModel(data);
            case Stock.name:
                return new this.stockModel(data);
            default:
                throw new Error('Unknown source');
        }
    }

    findAll() {
        // Exclude items where the `source` field is either 'Stock' or 'Supplier'
        return this.trashModel
            .find({ source: { $nin: ['Stock', 'Account'] } }) // Use `$nin` to exclude these sources
            .exec();
    }
}
