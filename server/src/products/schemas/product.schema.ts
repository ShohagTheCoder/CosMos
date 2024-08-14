import { Schema } from 'mongoose';

export const ProductSchema = new Schema({
    name: String,
    price: Number,
    description: String,
    madeIn: { type: String, required: false, default: 'Bangladesh' },
});
