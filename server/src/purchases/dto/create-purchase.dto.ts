import { User } from 'src/users/entities/user.entity';

export class CreatePurchaseDto {
    supplier: object;
    products: object;
    receiver: {
        _id: string;
    };
    totalPrice: number;
    note: string;
    transaction: string;
}
