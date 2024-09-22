import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RegisterService {
    constructor(private usersService: UsersService) {}
    async register(createRegisterDto: any) {
        const existingShop = await this.usersService.findShop();
        const shopData = {
            name: createRegisterDto.shopName,
            phoneNumber: createRegisterDto.phoneNumber,
            password: createRegisterDto.password,
            role: 'shop',
        };
        const ownerdata = {
            name: createRegisterDto.name,
            phoneNumber: createRegisterDto.phoneNumber,
            password: createRegisterDto.password,
            role: 'owner',
        };

        // If shop does not already exist
        if (!existingShop) {
            try {
                const owner = await this.usersService.create(ownerdata); // Pass shopUser with role
                const shop = await this.usersService.create(shopData); // Pass shopUser with role
                return [shop, owner];
            } catch (error) {
                throw new Error('Failed to create Shop');
            }
        } else {
            throw new Error('Shop already exist');
        }
    }
}
