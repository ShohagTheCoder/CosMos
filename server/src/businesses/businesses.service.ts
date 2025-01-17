import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Business, BusinessDocument } from './schemas/business.schema';
import { Model } from 'mongoose';
import { Response } from 'src/common/utils/apiResponse';

@Injectable()
export class BusinessesService {
    constructor(
        @InjectModel(Business.name)
        private businessModel: Model<BusinessDocument>,
    ) {}

    async create(createBusinessDto: any): Promise<string> {
        const existingCount = await this.businessModel.countDocuments();

        if (existingCount === 0) {
            try {
                await this.businessModel.create(createBusinessDto);
                console.log('Business created successfully');
                return 'Business created successfully';
            } catch (error) {
                console.log('Faild to create business');
                console.log(error.message);
                return 'Faild to create business';
            }
        }

        console.log('Business already exists');
        return 'Business already exists';
    }

    async getPrintSetting() {
        const business = await this.businessModel.findOne().lean().exec();
        if (!business) {
            throw new Error('No business document fount.');
        }

        // Return response
        return new Response().data(business.settings.print).done();
    }

    findAll() {
        return `This action returns all businesses`;
    }

    findOne(id: number) {
        return `This action returns a #${id} business`;
    }

    update(id: number, updateBusinessDto: any) {
        return `This action updates a #${id} business`;
    }

    remove(id: number) {
        return `This action removes a #${id} business`;
    }
}
