import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';

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
    ) {}

    create(createUserDto: CreateUserDto) {
        return 'This action adds a new user';
    }

    findAll() {
        return `This action returns all users`;
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
