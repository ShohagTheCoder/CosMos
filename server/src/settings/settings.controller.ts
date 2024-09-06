import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}

    @Get()
    get() {
        return this.settingsService.get();
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateSettingDto: UpdateSettingDto,
    ) {
        return this.settingsService.update(+id, updateSettingDto);
    }
}
