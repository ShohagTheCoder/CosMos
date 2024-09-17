import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name)
        private categoryModel: Model<CategoryDocument>,
    ) {}

    async create(createCategoryDto: {
        name: string;
        description?: string;
        isActive?: boolean;
    }) {
        const { name, description, isActive } = createCategoryDto;

        // Check if a category with the same name already exists
        const existingCategory = await this.categoryModel
            .findOne({ name })
            .exec();
        if (existingCategory) {
            throw new ConflictException(
                'A category with this name already exists.',
            );
        }

        const createdCategory = new this.categoryModel({
            name,
            description,
            isActive,
        });
        return createdCategory.save();
    }

    async findAll() {
        return this.categoryModel.find().exec();
    }

    async findOne(id: string) {
        return this.categoryModel.findById(id).exec();
    }

    async update(
        id: string,
        updateCategoryDto: {
            name?: string;
            description?: string;
            isActive?: boolean;
        },
    ) {
        return this.categoryModel
            .findByIdAndUpdate(id, updateCategoryDto, { new: true })
            .exec();
    }

    async remove(id: string) {
        return this.categoryModel.findByIdAndDelete(id).exec();
    }
}
