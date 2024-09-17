import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';
import { Model } from 'mongoose';

@Injectable()
export class SettingsService {
    constructor(
        @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
    ) {}

    async findOne(id: string) {
        const setting = await this.settingModel.findById(id);

        if (setting) {
            return setting.toObject();
        }
        throw new Error('Setting not found');
    }

    async findByUserId(id: string) {
        const setting = await this.settingModel.findOne({
            user: id,
        });

        if (setting) {
            return setting.toObject();
        }
        throw new Error('Setting not found');
    }

    async darkMode(id: string) {
        const setting = await this.settingModel.findOne({
            user: id,
        });

        if (setting) {
            return setting.toObject().darkMode;
        }
        throw new Error('Setting not found');
    }

    async update(id: string, updateSettingDto: any) {
        const setting = await this.settingModel.findById(id);

        if (setting) {
            Object.assign(setting, updateSettingDto);
            return setting.save();
        }

        throw new Error('Setting not found for id ' + id);
    }
}
