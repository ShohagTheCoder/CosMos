import { Product } from 'src/products/dto/schemas/product.schema';

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
        account: string;
    };
    products: Record<string, Product>;
    due: number;
    paid: number;
    note: string;
    customerTotalDue: number;
}
