export interface Customer {
    _id: string; // MongoDB unique identifier
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    balance: number;
    image: string;
    account: string;
}

export interface CustomerWithId extends Customer {
    _id: string; // MongoDB unique identifier
}
