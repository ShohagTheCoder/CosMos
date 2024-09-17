import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.settingsService.findOne(id);
    }

    @Get('findByUserId/:id')
    async findByUserId(@Param('id') id: string) {
        return await this.settingsService.findByUserId(id);
    }

    @Get('byUserId/:id/darkMode')
    async darkMode(@Param('id') id: string) {
        return await this.settingsService.darkMode(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateSettingDto: any) {
        return await this.settingsService.update(id, updateSettingDto);
    }
}
