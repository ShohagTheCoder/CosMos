import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Product } from './interfaces/product.interface';
// import { CreateProductDto } from './dto/CreateProductDto';
// import { UpdateProductDto } from './dto/UpdateProductDto';
import { ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel('Product')
        private readonly productModel: Model<ProductDocument>,
    ) {}

    findAll() {
        return this.productModel.find();
    }

    findOne(id: string) {
        return this.productModel.findById(id);
    }

    create(createProductDto: any) {
        const createdProduct = new this.productModel(createProductDto);
        return createdProduct.save();
    }

    update(id: string, updateProductDto: any) {
        return this.productModel.findByIdAndUpdate(id, updateProductDto);
    }

    delete(id: string) {
        return this.productModel.findByIdAndDelete(id);
    }
}
