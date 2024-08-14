import { Document } from 'mongoose';

export interface Sell extends Document {
    totalPrice: number;
    note?: string; // Optional field
    user: string; // Assuming user ID is a string
    cart: any; // If you have a specific structure for cart, replace `any` with that type
    dateTime: Date;
}
