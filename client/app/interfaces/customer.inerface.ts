export interface Customer {
    _id: string; // MongoDB unique identifier
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    balance: number;
}

export interface CustomerWithId {
    _id: string; // MongoDB unique identifier
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    balance: number;
}
