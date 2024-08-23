export interface Customer {
    _id: string; // MongoDB unique identifier
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    balance: number;
    account: string;
}

export interface CustomerWithId {
    _id: string; // MongoDB unique identifier
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    balance: number;
    account: string;
}
