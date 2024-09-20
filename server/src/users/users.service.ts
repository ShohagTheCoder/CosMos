import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { Account, AccountDocument } from 'src/accounts/schemas/account.schema';
import { Setting, SettingDocument } from 'src/settings/schemas/setting.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
        @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
    ) {}

    async create(createUserDto: any) {
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

        const setting = new this.settingModel({
            user: user._id.toString(),
            darkMode: true,
        });

        // Updaet user setting fied
        user.setting = setting._id.toString();

        await user.save();
        await setting.save();
        return await account.save();
    }

    findAll() {
        return this.userModel.find();
    }

    async findShop() {
        return await this.userModel.findOne({ role: 'shop' });
    }

    async findOne(id: string) {
        if (id) {
            let user = await this.userModel.findById(id);
            if (user) {
                user = user.toObject();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
                const { password, ...result } = user;
                return result;
            }
            throw new UnauthorizedException('User not found');
        } else {
            throw new UnauthorizedException('Id not found');
        }
    }

    async findByUsername(username: string) {
        const user = await this.userModel.findOne({ name: username }).exec();
        return user ? user.toObject() : null;
    }

    update(id: number, updateUserDto: any) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
