import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { UserSchema } from './schemas/user.schema';
import { Account, AccountSchema } from 'src/accounts/schemas/account.schema';
import { Setting, SettingSchema } from 'src/settings/schemas/setting.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Account.name, schema: AccountSchema },
            { name: Setting.name, schema: SettingSchema },
        ]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
