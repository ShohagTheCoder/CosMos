import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier, SupplierDocument } from './schemas/supplier.schema';
import { Model } from 'mongoose';
import { TrashService } from 'src/trash/trash.service';
import { Account, AccountDocument } from 'src/accounts/schemas/account.schema';

@Injectable()
export class SuppliersService {
    constructor(
        @InjectModel(Supplier.name)
        private supplierModel: Model<SupplierDocument>,
        private trashService: TrashService,
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    ) {}

    async create(createSupplierDto: any) {
        const supplier = new this.supplierModel(createSupplierDto);
        const account = new this.accountModel({
            owner: supplier._id.toString(),
            name: createSupplierDto.name,
            type: 'supplier',
            username: createSupplierDto.email,
            password: createSupplierDto.password,
            balance: 0,
            minimumBalance: 1000,
            maximumBalance: 10000,
            limit: 10000,
        });

        supplier.account = account._id.toString();

        try {
            account.save();
            return await supplier.save();
        } catch (error) {
            throw new Error('Faild to create suppllier');
        }
    }

    findAll() {
        return this.supplierModel.find();
    }

    async addProduct(id: string, productId: string) {
        try {
            const supplier = await this.supplierModel.findById(id);
            if (!supplier) {
                throw new Error('Supplier not found');
            }

            supplier.products.push(productId);
            await supplier.save();

            return supplier;
        } catch (error) {
            throw new Error(`Failed to add product: ${error.message}`);
        }
    }

    findOne(id: string) {
        return this.supplierModel.findById(id);
    }

    async update(id: string, updateSupplierDto: UpdateSupplierDto) {
        const supplier = await this.supplierModel.findById(id);
        if (!supplier) {
            throw new NotFoundException(`Supplier with ID #${id} not found`);
        }

        Object.assign(supplier, updateSupplierDto);
        await supplier.save();

        return supplier;
    }

    async removeProduct(id: string, productId: string) {
        try {
            const supplier = await this.supplierModel.findById(id);
            if (!supplier) {
                throw new Error('Supplier not found');
            }

            // Find the index of the product to remove
            const index = supplier.products.indexOf(productId);
            if (index === -1) {
                throw new Error('Product not found in supplier');
            }

            // Remove the product from the array
            supplier.products.splice(index, 1);
            await supplier.save();

            return supplier;
        } catch (error) {
            throw new Error(`Failed to remove product: ${error.message}`);
        }
    }

    async remove(id: string) {
        try {
            // Find the supplier by ID
            const supplier = await this.supplierModel.findById(id);

            // Handle the case where the supplier might not be found
            if (!supplier) {
                throw new Error('Supplier not found');
            }

            // Move the product to the trash before deleting
            await this.trashService.create(Supplier.name, supplier);

            // Delete the supplier and return the result
            return await supplier.deleteOne();
        } catch (error) {
            throw new Error('Failed to delete supplier'); // More descriptive error message
        }
    }
}
