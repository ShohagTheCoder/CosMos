import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {}

    @Post()
    create(@Body() createAccountDto: any) {
        return this.accountsService.create(createAccountDto);
    }

    @Post('send-money')
    sendMoney(@Body() sendMoneyDto: any) {
        console.log(sendMoneyDto);
        return this.accountsService.sendMoney(sendMoneyDto);
    }

    @Get()
    findAll() {
        return this.accountsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.accountsService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateAccountDto: UpdateAccountDto,
    ) {
        return this.accountsService.update(+id, updateAccountDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.accountsService.remove(+id);
    }
}
