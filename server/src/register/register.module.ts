import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { UsersService } from 'src/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
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
    controllers: [RegisterController],
    providers: [RegisterService, UsersService],
})
export class RegisterModule {}
