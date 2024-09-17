import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';

@Injectable()
export class BrandsService {
    constructor(
        @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
    ) {}

    async create(createBrandDto: {
        name: string;
        description?: string;
        isActive?: boolean;
    }): Promise<Brand> {
        // Check if a brand with the same name already exists
        const existingBrand = await this.brandModel
            .findOne({ name: createBrandDto.name })
            .exec();

        if (existingBrand) {
            throw new ConflictException(
                'A brand with this name already exists.',
            );
        }

        const newBrand = new this.brandModel(createBrandDto);
        return newBrand.save();
    }

    async findAll(): Promise<Brand[]> {
        return await this.brandModel.find().exec();
    }

    async findOne(id: string): Promise<Brand> {
        const brand = await this.brandModel.findById(id).exec();
        if (!brand) {
            throw new NotFoundException(`Brand with ID ${id} not found`);
        }
        return brand;
    }

    async update(id: string, updateBrandDto: any): Promise<Brand> {
        const updatedBrand = await this.brandModel
            .findByIdAndUpdate(id, updateBrandDto, { new: true })
            .exec();
        if (!updatedBrand) {
            throw new NotFoundException(`Brand with ID ${id} not found`);
        }
        return updatedBrand;
    }

    async remove(id: string): Promise<Brand> {
        const deletedBrand = await this.brandModel.findByIdAndDelete(id).exec();
        if (!deletedBrand) {
            throw new NotFoundException(`Brand with ID ${id} not found`);
        }
        return deletedBrand;
    }
}
