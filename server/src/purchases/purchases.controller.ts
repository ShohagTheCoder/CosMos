import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('purchases')
export class PurchasesController {
    constructor(private readonly purchasesService: PurchasesService) {}

    @Post()
    async create(@Body() createPurchaseDto: CreatePurchaseDto) {
        return await this.purchasesService.create(createPurchaseDto);
    }

    @Get('query')
    findByQuery(@Query() query: any) {
        return this.purchasesService.findByQuery(query);
    }

    @Get()
    findAll() {
        return this.purchasesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.purchasesService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePurchaseDto: UpdatePurchaseDto,
    ) {
        return this.purchasesService.update(+id, updatePurchaseDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.purchasesService.remove(+id);
    }
}
