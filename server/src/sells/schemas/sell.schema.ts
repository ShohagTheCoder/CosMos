import { Schema } from 'mongoose';

export const SellSchema = new Schema({
    totalPrice: {
        type: Number,
        required: true, // Makes sure totalPrice is always provided
        min: 0, // Ensures totalPrice is not negative
    },
    note: {
        type: String,
        maxlength: 500, // Optional: Limits note length to 500 characters
    },
    user: {
        type: Schema.Types.Mixed,
        required: true,
    },
    cart: {
        type: Schema.Types.Mixed, // Allows for any type of value
        required: true,
    },
    dateTime: {
        type: Date,
        required: true,
        default: Date.now,
    },
});
