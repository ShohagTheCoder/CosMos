import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { SellsService } from './sells.service';
import { CreateSellDto } from './dto/create-sell.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { Permissions } from 'src/auth/guards/permissions';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Permissions('sale')
@Controller('sells')
export class SellsController {
    constructor(private readonly sellsService: SellsService) {}

    @Post()
    async create(@Body() createSellDto: CreateSellDto) {
        // Use the correct DTO type
        return this.sellsService.create(createSellDto);
    }

    @Post('pending')
    async createPending(@Body() createSellDto: CreateSellDto) {
        // Use the correct DTO type
        return this.sellsService.createPending(createSellDto);
    }

    @Get('query')
    async findByQuery(@Query() query: any) {
        return await this.sellsService.findByQuery(query);
    }

    @Get('findByUser/:id')
    async findByUser(@Param('id') id: string) {
        return this.sellsService.findByUser(id);
    }

    @Get('findByCustomer/:id')
    async findByCustomer(@Param('id') id: string) {
        return await this.sellsService.findByCustomer(id);
    }

    @Get('pending')
    async findAllPending() {
        return this.sellsService.findAllPending();
    }
    @Get('pending/:id')
    async findPendingById(@Param('id') id: string) {
        return this.sellsService.findPendingById(id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.sellsService.findOne(id);
    }

    @Get()
    async findAll() {
        return this.sellsService.findAll();
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateSellDto: any, // Assuming an Update DTO
    ) {
        return this.sellsService.update(id, updateSellDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<any> {
        return this.sellsService.remove(id);
    }
}
