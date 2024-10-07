import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Post()
    create(@Body() createTransactionDto: any) {
        return this.transactionsService.create(createTransactionDto);
    }

    @Get('countDocuments')
    async countDocuments() {
        return await this.transactionsService.countDocuments();
    }

    @Get('query')
    async findByQuery(@Query() query: any) {
        return await this.transactionsService.findByQuery(query);
    }

    @Get()
    findAll() {
        return this.transactionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.transactionsService.findOne(id);
    }
}
