import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { Account } from 'src/accounts/schemas/account.schema';
import { AccountDocument } from 'src/accounts/schemas/account.schema';

@Injectable()
export class CustomersService {
    constructor(
        @InjectModel('Customer')
        private customerModel: Model<CustomerDocument>,
        @InjectModel(Account.name)
        private accountModel: Model<AccountDocument>,
    ) {}

    async create(createCustomerDto: any) {
        const { name, phoneNumber } = createCustomerDto;
        const account = {
            name: name,
            type: 'customer',
            username: phoneNumber,
            password: 'password',
            balance: 0,
            minimumBalance: 10000,
            maximumBalance: 10000,
            limit: 10000,
        };

        const createdAccount = new this.accountModel(account);
        const createdCustomer = new this.customerModel(createCustomerDto);

        // Exchange id
        createdAccount.owner = createdCustomer._id.toString();
        createdCustomer.account = createdAccount._id.toString();

        await createdAccount.save();
        return await createdCustomer.save();
    }

    async findAll(): Promise<Customer[]> {
        return this.customerModel.find().exec();
    }

    async findOne(id: string): Promise<Customer | null> {
        return this.customerModel.findById(id);
    }

    async update(id: string, updateCustomerDto): Promise<Customer | null> {
        return this.customerModel.findByIdAndUpdate(id, updateCustomerDto);
    }

    async remove(id: string): Promise<Customer | null> {
        return this.customerModel.findByIdAndDelete(id);
    }
}
