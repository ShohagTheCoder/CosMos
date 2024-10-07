import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {}

    @Post()
    create(@Body() createAccountDto: any) {
        return this.accountsService.create(createAccountDto);
    }

    @Post('cashout')
    async cashout(@Body() cashoutDto: any) {
        return await this.accountsService.cashout(cashoutDto);
    }

    @Post('sendMoney')
    sendMoney(@Body() sendMoneyDto: any) {
        if (this.accountsService.sendMoney(sendMoneyDto)) {
            return {
                status: 'success',
                message: 'Send money successfull',
                data: null,
            };
        } else {
            throw new Error('Faild to send money');
        }
    }

    @Get()
    findAll() {
        return this.accountsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.accountsService.findOne(id);
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
