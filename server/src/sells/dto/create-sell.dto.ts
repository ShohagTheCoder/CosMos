// Define the type for createSellDto
export interface CreateSellDto {
    totalPrice: number;
    customer?: object;
    user: object;
    cart: object;
}
