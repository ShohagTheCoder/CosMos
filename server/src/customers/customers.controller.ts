import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
} from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) {}

    @Post()
    async create(@Body() createCustomerDto) {
        return this.customersService.create(createCustomerDto);
    }

    @Get()
    async findAll() {
        return this.customersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.customersService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateCustomerDto) {
        return this.customersService.update(id, updateCustomerDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.customersService.remove(id);
    }
}
