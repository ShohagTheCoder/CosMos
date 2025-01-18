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
                return 'Business created successfully';
            } catch (error) {
                return 'Faild to create business';
            }
        }

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

    async updatePrintSetting(printSettingDto: any) {
        const business = await this.businessModel.findOne().exec();

        if (!business) {
            throw new Error('Business not found'); // Or handle it with your custom error response
        }

        // Use set() or markModified() for proper change detection in nested objects
        business.settings.print = { ...printSettingDto }; // Or business.settings.print = printSettingDto directly if it's a full object replacement

        // Alternatively, use markModified if the above still doesn't trigger the save
        business.markModified('settings.print'); // Tells Mongoose to track changes in the nested object

        // Save the updated business document
        await business.save(); // Wait for the save operation to complete

        return new Response().success().done(); // Or adjust based on your response handling
    }

    update(id: number, updateBusinessDto: any) {
        return `This action updates a #${id} business`;
    }

    remove(id: number) {
        return `This action removes a #${id} business`;
    }
}
