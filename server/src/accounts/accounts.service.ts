import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './schemas/account.schema';

@Injectable()
export class AccountsService {
    constructor(
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    ) {}

    async create(createAccountDto: any) {
        try {
            const account = new this.accountModel(createAccountDto);
            return await account.save();
        } catch (error) {
            throw new Error('Account faild');
        }
    }

    findAll() {
        return `This action returns all accounts`;
    }

    findOne(id: number) {
        return `This action returns a #${id} account`;
    }

    update(id: number, updateAccountDto: UpdateAccountDto) {
        return `This action updates a #${id} account`;
    }

    remove(id: number) {
        return `This action removes a #${id} account`;
    }
}
