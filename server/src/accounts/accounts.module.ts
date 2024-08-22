import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './schemas/account.schema';
import {
    Transaction,
    TransactionSchema,
} from 'src/transactions/schemas/transaction.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Account.name, schema: AccountSchema },
            { name: Transaction.name, schema: TransactionSchema },
        ]),
    ],
    controllers: [AccountsController],
    providers: [AccountsService],
})
export class AccountsModule {}
