import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SellsModule } from './sells/sells.module';
import { CustomersModule } from './customers/customers.module';
import { UsersModule } from './users/users.module';
import { ActivitiesModule } from './activities/activities.module';
import { CompaniesModule } from './companies/companies.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { UnitsController } from './units/units.controller';
import { UnitsService } from './units/units.service';
import { UnitsModule } from './units/units.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/CosMos'),
        ProductsModule,
        SellsModule,
        CustomersModule,
        UsersModule,
        ActivitiesModule,
        CompaniesModule,
        SuppliersModule,
        UnitsModule,
    ],
    controllers: [AppController, UnitsController],
    providers: [AppService, UnitsService],
})
export class AppModule {}
