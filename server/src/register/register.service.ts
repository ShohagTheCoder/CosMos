import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RegisterService {
    constructor(private usersService: UsersService) {}
    async register(createRegisterDto: any) {
        const existingShop = await this.usersService.findShop();
        const shopUser = { ...createRegisterDto };
        shopUser.role = 'shop';

        // If shop does not already exist
        if (!existingShop) {
            const shop = await this.usersService.create(shopUser); // Pass shopUser with role

            if (shop) {
                return shop;
            }

            throw new Error('Failed to create Shop');
        } else {
            throw new Error('Shop already exist');
        }
    }
}
