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

    async trash(source: string, data: any) {
        const trash = new this.trashModel({ source, data });
        try {
            return await trash.save();
        } catch (error) {
            // Handle or log the error as needed
            throw new Error('Failed to save to trash: ' + error.message);
        }
    }

    async trashGroup(items: TrashItem[]): Promise<TrashDocument[]> {
        const savedItems: TrashDocument[] = [];
        const connect = items[0].data._id; // Assuming all items in the group have the same connect value

        for (const item of items) {
            const trash = new this.trashModel({
                source: item.source, // Collection name or identifier
                connect: connect,
                data: item.data, // Document data
            });

            try {
                const savedItem = await trash.save();
                savedItems.push(savedItem);
            } catch (error) {
                // Handle or log the error as needed
                throw new Error(
                    'Failed to save item to trash: ' + error.message,
                );
            }
        }

        return savedItems;
    }

    async restore(id: string): Promise<TrashDocument[]> {
        // Find the trash item by its ID and cast it as TrashDocument
        const trashItem = (await this.trashModel
            .findById(id)
            .exec()) as TrashDocument;

        // Handle case where trash item is not found
        if (!trashItem) {
            throw new Error('Trash item not found');
        }

        // Extract the source collection, data, and connect value
        const { source, data, connect } = trashItem;

        // Find all connected items in the trash and cast as TrashDocument[]
        const connectedItems = (await this.trashModel
            .find({ connect })
            .exec()) as TrashDocument[];

        // Array to store restored items
        const restoredItems: any[] = [];

        // Restore each connected item
        for (const item of connectedItems) {
            // Get the correct model based on the source
            const restoredItem = this.getModelByName(item.source, item.data);

            try {
                // Save the restored item back to its original collection
                await restoredItem.save();
                restoredItems.push(restoredItem);
            } catch (error) {
                throw new Error('Failed to restore item: ' + error.message);
            }

            // Remove the item from the trash collection
            await this.trashModel.findByIdAndDelete(item._id).exec();
        }

        return restoredItems;
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
        return this.trashModel.find();
    }

    findOne(id: number) {
        return `This action returns a #${id} trash`;
    }

    remove(id: number) {
        return `This action removes a #${id} trash`;
    }
}
