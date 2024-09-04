export interface Supplier {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    account: string;
    products: string[];
}

export interface SupplierWithId {
    _id: string; // MongoDB unique identifier
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    account: string;
    products: string[];
}
