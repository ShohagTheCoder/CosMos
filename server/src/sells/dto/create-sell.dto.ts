// Define the type for createSellDto
export interface CreateSellDto {
    totalPrice: number;
    customer?: {
        _id: string;
        name: string;
        account: string;
    };
    user: {
        _id: string;
        name: string;
    };
    products: object;
    due: number;
    paid: number;
    note: string;
    customerTotalDue: number;
}
