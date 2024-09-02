import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { Account, AccountDocument } from 'src/accounts/schemas/account.schema';

const users = [
    {
        id: 1,
        name: 'Shohag Ahmed',
        password: 'pass',
        canSell: true,
        verify: 'Shohag Ahmed',
    },
    {
        id: 2,
        name: 'Imradul Haq Imran',
        password: 'pass',
        canSell: false,
        verify: 'Shohag Ahmed',
    },
];

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    ) {}

    create(createUserDto: any) {
        const user = new this.userModel(createUserDto);
        const account = new this.accountModel({
            owner: user._id.toString(),
            name: createUserDto.name,
            type: 'sell',
            username: createUserDto.email,
            password: createUserDto.password,
            balance: 0,
            minimumBalance: 1000,
            maximumBalance: 10000,
            limit: 10000,
        });
        user.account = account._id.toString();

        user.save();
        return account.save();
    }

    findAll() {
        return this.userModel.find();
    }

    findOne(id: number) {
        return this.userModel.findById(id);
    }

    async findByUsername(username: string) {
        // return await this.userModel.findOne({ fullname: username });
        return users.find((user) => user.name == username);
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
