import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { BusinessesService } from './businesses.service';

@Controller('businesses')
export class BusinessesController {
    constructor(private readonly businessesService: BusinessesService) {}

    @Post()
    create(@Body() createBusinessDto: any) {
        return this.businessesService.create(createBusinessDto);
    }

    @Get('settings/print')
    getPrintSetting() {
        return this.businessesService.getPrintSetting();
    }

    @Get()
    findAll() {
        return this.businessesService.findAll();
    }

    @Get('get')
    findBusiness() {
        return this.businessesService.findAll();
    }

    @Get('set/setting/print')
    setPrintSetting() {
        return this.businessesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.businessesService.findOne(+id);
    }

    @Patch('settings/print')
    updatePrintSetting(@Body() updatePrintSettingDto: any) {
        return this.businessesService.updatePrintSetting(updatePrintSettingDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBusinessDto: any) {
        return this.businessesService.update(+id, updateBusinessDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.businessesService.remove(+id);
    }
}
