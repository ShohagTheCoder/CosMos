export interface Product {
    _id: string; // MongoDB unique identifier
    name: string;
    price: number;
    description?: string;
    madeIn?: string; // Added based on your document structure
    __v?: number; // Version key (usually used by MongoDB)
}
