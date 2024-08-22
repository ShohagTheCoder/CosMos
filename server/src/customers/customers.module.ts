import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { Account } from 'src/accounts/schemas/account.schema';
import { AccountSchema } from 'src/accounts/schemas/account.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Customer.name, schema: CustomerSchema },
            { name: Account.name, schema: AccountSchema },
        ]),
    ],
    controllers: [CustomersController],
    providers: [CustomersService],
})
export class CustomersModule {}
