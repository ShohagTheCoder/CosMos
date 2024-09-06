import { Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
    get() {
        return {
            darkMode: true,
        };
    }

    update(id: number, updateSettingDto: UpdateSettingDto) {
        return `This action updates a #${id} setting`;
    }
}
