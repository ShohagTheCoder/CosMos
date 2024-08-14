import { createSlice } from "@reduxjs/toolkit";

export interface CartItem {
    _id: string;
    name: string;
    price: number;
}

export interface CartState {
    items: Record<string, CartItem>;
    totalItem: number;
    totalPrice: number;
}

const initialState: CartState = {
    items: {},
    totalItem: 0,
    totalPrice: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action) {
            state.items[action.payload._id] = action.payload;
            state.totalPrice = action.payload.price;
            state.totalItem += 1;
        },
    },
});

import React from "react";

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
