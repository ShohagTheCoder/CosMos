import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) {}

    @Post()
    async create(@Body() createBrandDto: any) {
        return await this.brandsService.create(createBrandDto);
    }

    @Get()
    async findAll() {
        return await this.brandsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.brandsService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateBrandDto: any) {
        return await this.brandsService.update(id, updateBrandDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.brandsService.remove(id);
    }
}
