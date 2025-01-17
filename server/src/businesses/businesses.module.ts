import { Module } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Business, BusinessSchema } from './schemas/business.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { schema: BusinessSchema, name: Business.name },
        ]),
    ],
    controllers: [BusinessesController],
    providers: [BusinessesService],
})
export class BusinessesModule {}
