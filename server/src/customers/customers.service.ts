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
        const account = {
            name: createCustomerDto.name,
            owner: null,
            username: createCustomerDto.phoneNumber,
            password: 'password',
            balance: 0,
            minimumBalance: -1000,
            maximumBalance: 1000,
            limit: 1000,
            // lastTransaction: null,
            // lastTransactionAccountName: null,
            // lastTransactionAction: null,
            // lastTransactionAmount: 0,
            // lastTransactionDate: null,
            // lastTransactionNote: null,
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
        return this.customerModel.findByIdAndUpdate(id, updateCustomerDto, {
            new: true,
        });
    }

    async remove(id: string): Promise<Customer | null> {
        return this.customerModel.findByIdAndDelete(id);
    }
}
