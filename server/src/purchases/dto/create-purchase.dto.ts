export class CreatePurchaseDto {
    supplier: object;
    products: object;
    user: {
        _id: string;
        account: string;
    };
    totalPrice: number;
    note: string;
    transaction: string;
}
