import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trash, TrashDocument } from './schemas/trash.schema';
import { Product, ProductDocument } from 'src/products/schemas/product.schema';
import {
    Supplier,
    SupplierDocument,
} from 'src/suppliers/schemas/supplier.schema';

@Injectable()
export class TrashService {
    constructor(
        @InjectModel(Trash.name) private trashModel: Model<TrashDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(Supplier.name)
        private supplierModel: Model<SupplierDocument>,
    ) {}

    async create(source: string, data: any) {
        const trash = new this.trashModel({ source, data });
        try {
            return await trash.save();
        } catch (error) {
            // Handle or log the error as needed
            throw new Error('Failed to save to trash: ' + error.message);
        }
    }

    async restore(id: string) {
        // Find the trash item by its ID
        const trashItem = await this.trashModel.findById(id);

        // Handle case where trash item is not found
        if (!trashItem) {
            throw new Error('Trash item not found');
        }

        // Extract the source collection and data
        const { source, data }: any = trashItem;

        // Assume that you have access to the model of the original collection
        // You need to use the correct model based on the `source`
        const restoredItem = this.getModelByName(source, data);

        // Save the restored item back to its original collection
        try {
            await restoredItem.save();
        } catch (error) {
            throw new Error('Failed to restore item: ' + error.message);
        }

        // Remove the item from the trash collection
        await this.trashModel.findByIdAndDelete(id);

        return restoredItem;
    }

    private getModelByName(source: string, data: any) {
        switch (source) {
            case Product.name:
                return new this.productModel(data);
            case Supplier.name:
                return new this.supplierModel(data);
            default:
                throw new Error('Unknown source type');
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
