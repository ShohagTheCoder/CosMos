import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';

@Injectable()
export class CustomersService {
    constructor(
        @InjectModel('Customer')
        private customerModel: Model<CustomerDocument>,
    ) {}

    async create(createCustomerDto): Promise<Customer> {
        const createdCustomer = new this.customerModel(createCustomerDto);
        return createdCustomer.save();
    }

    async findAll(): Promise<Customer[]> {
        return this.customerModel.find().exec();
    }

    async findOne(id: string): Promise<Customer | null> {
        return this.customerModel.findById(id);
    }

    async update(id: string, updateCustomerDto): Promise<Customer | null> {
        return this.customerModel.findByIdAndUpdate(id, updateCustomerDto, {
            new: true,
        });
    }

    async remove(id: string): Promise<Customer | null> {
        return this.customerModel.findByIdAndDelete(id);
    }
}
