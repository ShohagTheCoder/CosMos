import { Supplier } from "@/app/interfaces/supplier.interface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { createSlice } from "@reduxjs/toolkit";

export interface StockState {
    products: Record<string, ProductWithID>;
    totalPrice: number;
    supplier?: Supplier;
    activeProduct?: string;
    selectedProductIndex: number;
    cartOnly: boolean;
    totalOnly: boolean;
}

export const initialStockState: StockState = {
    selectedProductIndex: 0,
    products: {},
    totalPrice: 0,
    cartOnly: false,
    totalOnly: false,
};

const stockSlice = createSlice({
    name: "stock",
    initialState: initialStockState,
    reducers: {
        updateStockState: (state, action) => {
            return action.payload;
        },
    },
});

export const { updateStockState } = stockSlice.actions;
export default stockSlice.reducer;
